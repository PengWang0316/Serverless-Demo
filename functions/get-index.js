'use strict';

const fs = require('fs');
const Mustache = require('mustache');
const axios = require('axios');

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
const getRestaurants = () => axios.get(process.env.restaurants_api);

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
