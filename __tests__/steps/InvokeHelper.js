const APP_ROOT = '../../';

const viaHandler = (handlerName, event = {}, context = {}) => {
  const handler = require(`${APP_ROOT}/functions/${handlerName}`).handler;

  return new Promise((resolve, reject) => {
    const callback = (err, response) => {
      if (err) reject(err);
      else {
        const contentType = response.headers && response.headers['Content-Type'] ? response.headers['Content-Type'] : 'application/json';
        if (response.body && contentType === 'application/json') response.body = JSON.parse(response.body);
      }
      resolve(response);
    };
    handler(event, context, callback);
  });
};

const invokeGetIndex = () => viaHandler('get-index');

const invokeGetRestaurants = () => viaHandler('get-restaurants');

module.exports = {
  invokeGetIndex,
  invokeGetRestaurants,
};
