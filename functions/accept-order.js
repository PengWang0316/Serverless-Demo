'use strict';

const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk')); // Use the X-Ray to capture all request makes through AWS sdk

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const { orderId, email, restaurantName } = body;

  console.log(`restaurant [${restaurantName}] accepted order ID [${orderId}] from user [${email}]`);

  const data = {
    orderId,
    email,
    restaurantName,
    eventType: 'order_accepted',
  };

  const req = {
    Data: JSON.stringify(data),
    StreamName: streamName,
    PartitionKey: orderId,
  };

  await kinesis.putRecord(req).promise();
  console.log('published \'order_accepted\' event into Kinesis');

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  };
  callback(null, response);
};
