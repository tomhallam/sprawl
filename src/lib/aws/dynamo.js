import { AWS, isOffline } from '.';

const localOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
};

export const docClient = isOffline()
  ? new AWS.DynamoDB.DocumentClient(localOptions)
  : new AWS.DynamoDB.DocumentClient();

export const rawClient = isOffline()
  ? new AWS.DynamoDB(localOptions)
  : new AWS.DynamoDB();
