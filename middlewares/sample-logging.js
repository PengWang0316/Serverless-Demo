'use strict';

module.exports = ({ sampleRate }) => {
  let logLevel;
  return {
    before: (handler, next) => {
      if (sampleRate && (Math.random() <= sampleRate)) {
        logLevel = process.env.log_level;
        process.env.log_level = 'DEBUG';
      }
      next();
    },
    after: (handler, next) => {
      if (logLevel) process.env.log_level = logLevel;
      next();
    },
  };
};
