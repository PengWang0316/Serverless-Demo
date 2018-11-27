'use strict';

const fs = require('fs');
const Mustache = require('mustache'); // Template library.
const axios = require('axios');
const aws4 = require('aws4'); // Signing http request library.
const URL = require('url'); // Come from node.js module

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday'];

var html; // Save the html content to a global variable to reuse.

// Use fs to read static html
const loadHtml = () => {
  if (html) return html;
  return new Promise((resolve, reject) => {
    fs.readFile('static/index.html', 'utf-8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Load the restaurants data
const getRestaurants = () => {
  // Use AWS4 to sign the request
  const url = URL.parse(process.env.restaurants_api);
  const opts = {
    host: url.hostname,
    path: url.pathname,
  };
  aws4.sign(opts);
  return axios.get(process.env.restaurants_api, {
    headers: {
      Host: opts.headers.Host,
      'X-Amz-Date': opts.headers['X-Amz-Date'],
      Authorization: opts.headers.Authorization,
      'X-Amz-Security-Token': opts.headers['X-Amz-Security-Token'],
    },
  });
};

// User a Lambda function to serve static content
module.exports.handler = async (event, context, callback) => {
  const template = await loadHtml();
  const restaurants = await getRestaurants();
  const returnHtml = Mustache.render(template, {
    dayOfWeek: days[new Date().getDay],
    restaurants: restaurants.data.Items,
  });

  const response = {
    statusCode: 200,
    body: returnHtml,
    headers: { // The default header is JSON
      'Content-Type': 'text/html; charset=UTF-8',
    },
  };

  callback(null, response);
};
