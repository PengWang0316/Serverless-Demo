'use strict';

const fs = require('fs');

var html; // Save the html content to a global variable to reuse.

const loadHtml = () => html ? html : new Promise((resolve, reject) => {
  fs.readFile('static/index.html', 'utf-8', (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

// User a Lambda function to serve static content
module.exports.handler = async (event, context, callback) => {
  const html = await loadHtml();
  const response = {
    statusCode: 200,
    body: html,
    headers: { // The default header is JSON
      'Content-Type': 'text/html; charset=UTF-8',
    },
  };

  callback(null, response);
};
