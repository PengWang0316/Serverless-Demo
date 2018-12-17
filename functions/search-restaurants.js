'use strict';

const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk')); // Use the X-Ray to capture all request makes through AWS sdk

const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

const fetchRestaurantsByTheme = (theme, resultNumber) => {
  const req = {
    TableName: tableName,
    Limit: resultNumber,
    FilterExpression: 'contains(themes, :theme)',
    ExpressionAttributeValues: { ':theme': theme },
  };
  return dynamodb.scan(req).promise();
};

module.exports.handler = async (event, context, callback) => {
  const req = JSON.parse(event.body);
  const restaurants = await fetchRestaurantsByTheme(req.theme, defaultResults);
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };
  callback(null, response);
};
