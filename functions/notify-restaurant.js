'use strict';

const middy = require('middy');

const getRecords = require('../libs/kinesis');
const notifyRestaurant = require('../libs/notify-restaurant');
const retryNotifyRestaurant = require('../libs/retry-notify-restaurant');
const sampleLoggin = require('../middlewares/sample-logging');
const flushMetrics = require('../middlewares/flush-metrics');

const handler = async (event, context, callback) => {
  // Get records from the event and keep the order_placed event
  const orders = getRecords(event).filter(record => record.eventType === 'order_placed');
  await orders.forEach(async order => {
    try {
      await notifyRestaurant(order);
    } catch (err) {
      retryNotifyRestaurant(order);
    }
  });

  callback(null, 'All done');
};
// Use the flush metric middleware to send metrics we collect from libs/notify-restaurant to the CloudWatch
module.exports = middy(handler).use(sampleLoggin).use(flushMetrics);
