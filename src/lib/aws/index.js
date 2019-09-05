import baseAWS from 'aws-sdk';
import XRay from 'aws-xray-sdk';

export function isOffline() {
  return process.env.IS_OFFLINE;
}

export const AWS = isOffline() ? baseAWS : XRay.captureAWS(baseAWS);
