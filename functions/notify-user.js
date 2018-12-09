'use strict';

const AWS = require('aws-sdk');
const getRecords = require('../libs/kinesis');

const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const topicArn = process.env.user_notification_topic;
const streamName = process.env.order_events_stream;

module.exports.handler = async (event, context, callback) => {
  // Get the correct records from the event.
  const records = getRecords(event).filter(record => record.eventType === 'order_placed');

  await records.forEach(async record => {
    await sns.publish({
      Message: JSON.stringify(record),
      TopicArn: topicArn,
    }).promise();
    console.log(`Notified the user [${record.restaurantName}] of record [${record.orderId}]`);

    const data = { ...record };
    data.eventType = 'user_notified';
    await kinesis.putRecord({
      Data: JSON.stringify(data),
      PartitionKey: record.id,
      StreamName: streamName,
    }).promise();
    console.log('Published \'user_notified\' event to Kinesis.');
  });

  callback(null, 'All done');
};
