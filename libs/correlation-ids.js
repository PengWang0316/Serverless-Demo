'use strict';

/**
 * This helper library creates a global variable to store the correlation ids for different functions.
 * The conventional format is x-correlation-id
 */

const clearAll = () => {
  global.CONTEXT = undefined;
};

const replaceAllWith = ctx => {
  global.CONTEXT = ctx;
};

const set = (key, value) => {
  // put a x-correlation prefix if only key is passed in
  let newKey = key; // Prevent to change the function paramters
  if (!key.startsWith('x-correlation-')) newKey = `x-correlation-${key}`;

  if (!global.CONTEXT) global.CONTEXT = {};

  global.CONTEXT[newKey] = value;
};

const get = () => global.CONTEXT || {};

module.exports = {
  clearAll,
  replaceAllWith,
  set,
  get,
};
