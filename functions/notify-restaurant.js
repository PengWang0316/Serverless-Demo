'use strict';

const getRecords = require('../libs/kinesis');
const notifyRestaurant = require('../libs/notify-restaurant');
const retryNotifyRestaurant = require('../libs/retry-notify-restaurant');

module.exports.handler = async (event, context, callback) => {
  // Get records from the event and keep the order_placed event
  const orders = getRecords(event).filter(record => record.eventType === 'order_placed');
  orders.forEach(order => {
    try {
      notifyRestaurant(order);
    } catch (err) {
      retryNotifyRestaurant(order);
    }
  });

  callback(null, 'All done');
};
