import { AWS, isOffline } from '.';

const localOptions = {
  region: 'eu-west-1',
  endpoint: 'http://localhost:3000',
};

export default isOffline()
  ? new AWS.Lambda(localOptions)
  : new AWS.Lambda();
