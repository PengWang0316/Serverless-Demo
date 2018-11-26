'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

const fetchRestaurants = resultNumber => {
  const req = {
    TableName: tableName,
    Limit: resultNumber,
  };
  return dynamodb.scan(req).promise();
};

module.exports.handler = async (event, context, callback) => {
  const restaurants = await fetchRestaurants(defaultResults);
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };
  callback(null, response);
};
