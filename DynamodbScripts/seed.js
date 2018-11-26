const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});
console.log(process.env.accessKeyId);
// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2018-11-26' });

const params = {
  RequestItems: {
    restaurants: [
      {
        PutRequest: {
          Item: {
            name: { S: 'Fangtasia' },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/fangtasia.png' },
            themes: { SS: ['true blood'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: "Shoney's" },
            image: { S: "https://d2qt42rcwzspd6.cloudfront.net/manning/shoney's.png" },
            themes: { SS: ['cartoon', 'rick and morty'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: "Freddy's BBQ Joint" },
            image: { S: "https://d2qt42rcwzspd6.cloudfront.net/manning/freddy's+bbq+joint.png" },
            themes: { SS: ['netflix', 'house of cards'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: 'Pizza Planet' },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/pizza+planet.png' },
            themes: { SS: ['netflix', 'toy story'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: 'Leaky Cauldron' },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/leaky+cauldron.png' },
            themes: { SS: ['movie', 'harry potter'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: "Lil' Bits" },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/lil+bits.png' },
            themes: { SS: ['cartoon', 'rick and morty'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: 'Fancy Eats' },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/fancy+eats.png' },
            themes: { SS: ['cartoon', 'rick and morty'] },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            name: { S: 'Don Cuco' },
            image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/don%20cuco.png' },
            themes: { SS: ['cartoon', 'rick and morty'] },
          },
        },
      },
    ],
  },
};

ddb.batchWriteItem(params, (err, data) => {
  if (err) console.log(err);
  else console.log('success', data);
});

/* Add one item */
// const paramsA = {
//   TableName: 'restaurants',
//   Item: {
//     name: { S: 'Don Cuco' },
//     image: { S: 'https://d2qt42rcwzspd6.cloudfront.net/manning/don%20cuco.png' },
//     themes: { SS: ['cartoon', 'rick and morty'] },
//   },
// };

// ddb.putItem(paramsA, (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });
