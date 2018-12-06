'use strict';

const AWS = require('aws-sdk');
const chance = require('chance').Chance();

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  const { restaurantName } = JSON.parse(event.body);
  const { email } = event.requestContext.authorizer.claims; // Get the email address from the Cognito user.
  const orderId = chance.guid(); // Generate a uuid for the oder id.

  console.log(`Placing an oder ${orderId} to ${restaurantName} for user ${email}`);

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
  console.log('Published order_placed event to Kinesis.');

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  };
  callback(null, response);
};
