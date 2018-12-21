import awscred from 'awscred';
import AWS from 'aws-sdk';

const region = 'us-west-2';
AWS.config.region = region;
const SSM = new AWS.SSM(); // Read paramters from EC2 paramter store

let isInitialized = false;

const getParameters = async keys => {
  const prefix = '/serverless-demo/dev/';
  const req = { Names: keys.map(key => `${prefix}${key}`) };
  const resp = await SSM.getParameters(req).promise();
  const params = {};
  resp.Parameters.forEach(param => { params[param.Name.substr(prefix.length)] = param.Value; });
  return params;
};

const init = () => new Promise(async (resolve, reject) => {
  if (isInitialized) resolve();
  const params = await getParameters([
    'cognito_user_pool_id',
    'cognito_client_id',
    'restaurants_api',
  ]);
  process.env.AWS_REGION = region;
  process.env.cognito_user_pool_id = params.cognito_user_pool_id;
  process.env.cognito_client_id = params.cognito_client_id;
  process.env.cognito_server_client_id = params.cognito_client_id;
  process.env.restaurants_api = params.restaurants_api;
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
