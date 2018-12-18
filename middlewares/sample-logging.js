'use strict';

const log = require('../libs/log');

module.exports = (option = { sampleRate: 0.01 }) => { // The defualt sample rate is 1%
  let logLevel;
  const { sampleRate } = option;
  return {
    before: (handler, next) => {
      if (Math.random() <= sampleRate) {
        logLevel = process.env.log_level;
        process.env.log_level = 'DEBUG';
      }
      next();
    },
    after: (handler, next) => {
      if (logLevel) process.env.log_level = logLevel;
      next();
    },
    onError: (handler, next) => { // Handle the error.
      const { awsRequestId } = handler.context;
      const invocationEvent = JSON.stringify(handler.event);
      log.error('Invocation failed', { awsRequestId, invocationEvent }, handler.error);
      next(handler.error);
    },
  };
};
