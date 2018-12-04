import awscred from '../../libs/awscred';

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
  awscred.loadCredentials((err, data) => {
    if (err) reject(err);
    process.env.AWS_ACCESS_KEY_ID = data.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = data.secretAccessKey;
    // This is for the CodePipeline.
    // When we run the code there, a temporary IAM role will be used. So we have to add it as the session token.
    if (data.sessionToken) process.env.AWS_SESSION_TOKEN = data.sessionToken;
    isInitialized = true;
    resolve();
  });
});
export default init;
