'use strict';

const AWS = require('aws-sdk');
const chance = require('chance').Chance();
const middy = require('middy');

const log = require('../libs/log');
const sampleLogging = require('../middlewares/sample-logging'); // A middleware for change the log_level based on a sample rate

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

const handler = async (event, context, callback) => {
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
// Use a middleware to change the log level with 20% chance.
module.exports = middy(handler).use(sampleLogging({ sampleRate: 0.2 }));
