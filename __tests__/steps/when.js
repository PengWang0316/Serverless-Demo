const APP_ROOT = '../../';

const invokeGetIndex = () => {
  const handler = require(`${APP_ROOT}/functions/get-index`).handler;

  return new Promise((resolve, reject) => {
    const callback = (err, response) => {
      if (err) reject(err);
      else {
        const contentType = response.headers['Content-Type'] ? response.headers['Content-Type'] : 'application/json';
        if (response.body && contentType === 'application/json') response.body = JSON.parse(response.body);
      }
      resolve(response);
    };
    handler({}, {}, callback);
  });
};
module.exports = {
  invokeGetIndex,
};
