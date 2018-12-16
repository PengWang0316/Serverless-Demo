'use strict';

const middy = require('middy');

const sampleLoggin = require('../middlewares/sample-logging');
const flushMetrics = require('../middlewares/flush-metrics');
const notifyRestaurant = require('../libs/notify-restaurant');

const handler = async (event, context, callback) => {
  const order = JSON.parse(event.Records[0].Sns.Message);
  order.retried = true;
  try {
    await notifyRestaurant(order);
    callback(null, 'All done');
  } catch (err) {
    callback(err);
  }
};
// Use the flush metric middleware to send metrics we collect from libs/notify-restaurant to the CloudWatch
module.exports = middy(handler).use(sampleLoggin).use(flushMetrics);
