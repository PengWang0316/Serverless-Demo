'use strict';

const AWS = require('aws-sdk');
const chance = require('chance').Chance();

const log = require('../libs/log');

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  log.debug('request body is a valid JSON', { requestBody: body });

  const { restaurantName } = body;
  const { email } = event.requestContext.authorizer.claims; // Get the email address from the Cognito user.
  const orderId = chance.guid(); // Generate a uuid for the oder id.

  log.debug('Placing an oder...', { orderId, restaurantName, email });

  const data = {
    restaurantName,
    email,
    orderId,
    eventType: 'order_placed',
  };

  const putReq = { // For Kinesis
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName,
  };
  await kinesis.putRecord(putReq).promise();
  log.debug('Published event to Kinesis...', { eventName: 'order_placed' });

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  };
  callback(null, response);
};
