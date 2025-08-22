import AWS from 'aws-sdk';

export function getS3() {
  const endpoint = process.env.R2_ENDPOINT;
  if (!endpoint) throw new Error('R2_ENDPOINT missing');

  return new AWS.S3({
    endpoint,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    region: 'auto',
    signatureVersion: 'v4',
    s3ForcePathStyle: true
  });
}
