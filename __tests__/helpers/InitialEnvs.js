import awscred from 'awscred';

let isInitialized = false;

const init = () => new Promise((resolve, reject) => {
  if (isInitialized) resolve();
  process.env.AWS_REGION = 'us-west-2';
  process.env.cognito_user_pool_id = 'us-west-2_sYFtW8M2B';
  process.env.cognito_client_id = '3rl1fppi7b958ahlfj9je9rk6s';
  process.env.cognito_server_client_id = '3rl1fppi7b958ahlfj9je9rk6s';
  process.env.restaurants_api = 'https://ztk1mf3sjc.execute-api.us-west-2.amazonaws.com/dev/restaurants';
  process.env.restaurants_table = 'restaurants';

  // User the awscred library to load credantial keys from the local profile.
  awscred.loadCredentials({ profile: 'voting-profile' }, (err, data) => {
    if (err) reject(err);
    process.env.AWS_ACCESS_KEY_ID = data.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = data.secretAccessKey;
    isInitialized = true;
    resolve();
  });
});
export default init;