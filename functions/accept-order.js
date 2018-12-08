'use strict';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const { orderId, userEmail, restaurantName } = body;

  console.log(`restaurant [${restaurantName}] accepted order ID [${orderId}] from user [${userEmail}]`);

  const data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: 'order_accepted',
  };

  const req = {
    Data: JSON.stringify(data),
    StreamName: streamName,
    PartitionKey: orderId,
  };

  await kinesis.putRecord(req);
  console.log('published \'order_accepted\' event into Kinesis');

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  };
  callback(null, response);
};
