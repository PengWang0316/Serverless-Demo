'use strict';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const streamName = process.env.order_events_stream;
const restaurantTopicArn = process.env.restaurant_notification_topic;

const chance = require('chance').Chance();

module.exports = async order => {
  if (chance.bool({ likelihood: 75 })) throw new Error('boom'); // Create a 75% of failure for testing purpose

  const pubReq = {
    Message: JSON.stringify(order),
    TopicArn: restaurantTopicArn,
  };
  await sns.publish(pubReq).promise(); // Publish to the sns

  console.log(`Notified the restaurant [${order.restaurantName}] of order [${order.orderId}]`);

  const data = { ...order }; // Clone order for Kinesis
  data.eventType = 'restaurant_notified'; // Change the event type to a new value
  const putRecordReq = {
    Data: JSON.stringify(data),
    PartitionKey: order.orderId,
    StreamName: streamName,
  };
  await kinesis.putRecord(putRecordReq).promise();
  console.log('Published \'restaurant_notified\' event to Kinesis.');
};
