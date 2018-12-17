'use strict';

const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk')); // Use the X-Ray to capture all request makes through AWS sdk

const cloudwatch = require('../libs/cloudwatch');

const sns = new AWS.SNS();

module.exports = async order => {
  try {
    const pubReq = {
      Message: JSON.stringify(order),
      TopicArn: process.env.retry_restaurant_notification_topic,
    };
    // await sns.publish(pubReq).promise(); // Publish to the sns
    // Put a metric to the cloud watch
    await cloudwatch('SnsPublishLatency', () => sns.publish(pubReq).promise());

    console.log(`Sent order [${order.orderId}] for [${order.restaurantName}] via sns to retry.`);
  } catch (err) {
    cloudwatch.incrCount('NotifyRestaurantQueued');
    throw err;
  }
};
