'use strict';

const AWS = require('aws-sdk');

const cloudwatch = require('../libs/cloudwatch'); // Use this library to put some metrics in

const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const streamName = process.env.order_events_stream;
const restaurantTopicArn = process.env.restaurant_notification_topic;

// const chance = require('chance').Chance();

module.exports = async order => {
  try {
    // if (chance.bool({ likelihood: 75 })) throw new Error('boom'); // Create a 75% of failure for testing purpose
    const pubReq = {
      Message: JSON.stringify(order),
      TopicArn: restaurantTopicArn,
    };
    // await sns.publish(pubReq).promise(); // Publish to the sns
    // Put the sns executing time to the cloudwatch function and wait to flush
    await cloudwatch.trackExecTime('SnsPublishLatency', () => sns.putRecord(pubReq).promise());

    console.log(`Notified the restaurant [${order.restaurantName}] of order [${order.orderId}]`);

    const data = { ...order }; // Clone order for Kinesis
    data.eventType = 'restaurant_notified'; // Change the event type to a new value
    const putRecordReq = {
      Data: JSON.stringify(data),
      PartitionKey: order.orderId,
      StreamName: streamName,
    };
    // await kinesis.putRecord(putRecordReq).promise();
    // Put the kinesis executing time to the cloudwatch function and wait to flush
    await cloudwatch.trackExecTime('KinesisPutRecordLatency', () => kinesis.putRecord(putRecordReq).promise());
    console.log('Published \'restaurant_notified\' event to Kinesis.');
    cloudwatch.incrCount('NotifyRestaurantSuccess');
  } catch (err) { // Put a metric to track the fialure time
    cloudwatch.incrCount('NotifyRestaurantFailed');
    throw err;
  }
};
