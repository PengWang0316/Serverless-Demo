'use strict';

// const http = require('superagent-promise')(require('superagent'), Promise);
const axios = require('axios');
const correlationIds = require('./correlation-ids');

const getHttpOption = ({ uri, method = 'get' }) => {
  switch (method.toLowerCase()) {
    case 'get':
    case 'head':
    case 'post':
    case 'put':
    case 'delete':
      return { url: uri, method };
    default:
      throw new Error(`unsupported method : ${method.toLowerCase()}`);
  }
};

// const setHeaders = headers => {
//   const headerNames = Object.keys(headers);
//   const newHeaders = {};
//   headerNames.forEach(h => {
//     newHeaders[h] = headers[h];
//   });

//   return newHeaders;
// };

// const setQueryStrings = qs => {
//   return !qs ? {} : { params: { ...qs } };
// };

// const setBody = body => {
//   return !body ? {} : { body };
// };

// options: {
//    uri     : string
//    method  : GET (default) | POST | PUT | HEAD
//    headers : object
//    qs      : object
//    body    : object
//  }
const Req = options => {
  if (!options) {
    throw new Error('no HTTP request options is provided');
  }

  if (!options.uri) {
    throw new Error('no HTTP uri is specified');
  }

  const context = correlationIds.get();

  // copy the provided headers last so it overrides the values from the context
  const headers = Object.assign({}, context, options.headers);

  // let request = getHttpOption(options);
  // const httpOptions = { ...getBody(options.body) }
  // request = setHeaders(request, headers);
  // request = setQueryStrings(request, options.qs);
  // request = setBody(request, options.body);

  return axios({
    ...getHttpOption(options), body: options.body, params: options.qs, headers,
  }).catch(e => {
    if (e.response && e.response.error) {
      throw e.response.error;
    }

    throw e;
  });
};

module.exports = Req;
