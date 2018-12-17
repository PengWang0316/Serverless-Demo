'use strict';

const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk')); // Use the X-Ray to capture all request makes through AWS sdk

const cloudwatch = require('../libs/cloudwatch');

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
  const restaurants = await cloudwatch.trackExecTime('DynamoDBScanLatency', () => fetchRestaurants(defaultResults));
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };
  cloudwatch.incrCount('RestaurantsReturned', restaurants.length);
  callback(null, response);
};
