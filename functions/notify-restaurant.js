'use strict';

const AWS = require('aws-sdk');
const getRecords = require('../libs/kinesis');

const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const streamName = process.env.order_events_stream;
const topicArn = process.env.restaurant_notification_topic;

module.exports.handler = async (event, context, callback) => {
  // Get records from the event and keep the order_placed event
  const orders = getRecords(event).filter(record => record.eventType === 'order_placed');
  await orders.forEach(async order => {
    const pubReq = {
      Message: JSON.stringify(order),
      TopicArn: topicArn,
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
  });

  callback(null, 'All done');
};
