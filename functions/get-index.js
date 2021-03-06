'use strict';

// const AWSXray = require('aws-xray-sdk');
const fs = require('fs');
const Mustache = require('mustache'); // Template library.
const axios = require('axios');
const aws4 = require('aws4'); // Signing http request library.
const awscred = require('awscred'); // To read the credantial keys from the local profile for the debug and testing purpose.
const URL = require('url'); // Come from node.js module
// const middy = require('middy');

// const sampleLogging = require('../middlewares/sample-logging');
// const correlationIds = require('../middlewares/capture-correlation-ids');
const cloudwatch = require('../libs/cloudwatch'); // Use this library to record metrics

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday'];

const awsRegion = process.env.AWS_REGION; // Lambda will feed this automatically
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;
const ordersApiRoot = process.env.orders_api;

var html; // Save the html content to a global variable to reuse.

// Use fs to read static html
const loadHtml = () => {
  if (html) return html;
  return new Promise((resolve, reject) => {
    fs.readFile('static/index.html', 'utf-8', (err, data) => {
      if (err) reject(err);
      html = data;
      resolve(data);
    });
  });
};

// Load the restaurants data
const getRestaurants = async () => {
  // Use AWS4 to sign the request
  const url = URL.parse(process.env.restaurants_api);
  const opts = {
    host: url.hostname,
    path: url.pathname,
  };

  // TODO: will be move to a helper function for reusing.
  // // User the awscred library to load credantial keys from the local profile.
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) await new Promise((resolve, reject) => {
    awscred.loadCredentials((err, data) => {
      if (err) reject(err);
      process.env.AWS_ACCESS_KEY_ID = data.accessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = data.secretAccessKey;
      // This is for the CodePipeline.
      // When we run the code there, a temporary IAM role will be used. So we have to add it as the session token.
      if (data.sessionToken) process.env.AWS_SESSION_TOKEN = data.sessionToken;
      resolve();
    });
  });

  aws4.sign(opts);

  const headers = {
    Host: opts.headers.Host,
    'X-Amz-Date': opts.headers['X-Amz-Date'],
    Authorization: opts.headers.Authorization,
    'X-Amz-Security-Token': opts.headers['X-Amz-Security-Token'],
  };
  // If 'X-Amz-Security-Token' does not exsit, delete it for the local test.
  if (!headers['X-Amz-Security-Token']) delete headers['X-Amz-Security-Token'];

  return axios.get(process.env.restaurants_api, {
    headers,
  });
};

// User a Lambda function to serve static content
module.exports.handler = async (event, context, callback) => {
  const template = await loadHtml();
  // Use cloudwatch library to record metrics asynchronously
  const restaurants = await cloudwatch.trackExecTime('GetRestaurantsLatency', () => getRestaurants());
  const returnHtml = Mustache.render(template, {
    dayOfWeek: days[new Date().getDay],
    restaurants: restaurants.data.Items,
    awsRegion,
    cognitoClientId,
    cognitoUserPoolId,
    placeOrderUrl: ordersApiRoot,
    searchUrl: `${process.env.restaurants_api}/search`,
  });

  cloudwatch.incrCount('RestaurantsReturned', restaurants.length);

  const response = {
    statusCode: 200,
    body: returnHtml,
    headers: { // The default header is JSON
      'Content-Type': 'text/html; charset=UTF-8',
    },
  };

  callback(null, response);
};
// The capture-correlation-ids middleware has to go first due to the sample-logging middleware need the context information it collected
// module.exports.handler = middy(handler).use(correlationIds()).use(sampleLogging());
