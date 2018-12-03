const awscred = require('awscred'); // To read the credantial keys from the local profile for the debug and testing purpose.

// Use the awscred library to load credantial keys from the local profile.
const loadCredentials = () => {
  if (process.env.AWS_ACCESS_KEY_ID) return;
  return new Promise((resolve, reject) => {
    awscred.loadCredentials({ profile: 'voting-profile' }, (err, data) => {
      if (err) reject(err);
      process.env.AWS_ACCESS_KEY_ID = data.accessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = data.secretAccessKey;
      resolve();
    });
  });
};
module.exports = loadCredentials;
