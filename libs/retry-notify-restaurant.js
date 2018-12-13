'use strict';

const AWS = require('aws-sdk');

const sns = new AWS.SNS();

module.exports = async order => {
  const pubReq = {
    Message: JSON.stringify(order),
    TopicArn: process.env.retry_restaurant_notification_topic,
  };
  await sns.publish(pubReq).promise(); // Publish to the sns

  console.log(`Sent order [${order.orderId}] for [${order.restaurantName}] via sns to retry.`);
};
