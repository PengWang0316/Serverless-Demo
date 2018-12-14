'use strict';

const notifyRestaurant = require('../libs/notify-restaurant');

module.exports.handler = async (event, context, callback) => {
  const order = JSON.parse(event.Records[0].Sns.Message);
  order.retried = true;
  try {
    await notifyRestaurant(order);
    callback(null, 'All done');
  } catch (err) {
    callback(err);
  }
};
