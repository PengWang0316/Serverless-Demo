'use strict';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  const { orderId, userEmail, restaurantName } = JSON.parse(event.body);
  console.log(`restaurant [${restaurantName}] fulfilled order ID [${orderId}] from user [${userEmail}]`);

  const data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: 'order_fulfilled',
  };
  await kinesis.putRecord({
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName,
  }).promise();

  console.log('published \'order_fulfilled\' event into Kinesis');

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  });
};
