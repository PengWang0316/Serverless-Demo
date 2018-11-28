'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

const fetchRestaurantsByTheme = (theme, resultNumber) => {
  const req = {
    TableName: tableName,
    Limit: resultNumber,
    filterExpression: 'contains(themes, :theme)',
    expressionAttributeValues: { ':theme': theme },
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
