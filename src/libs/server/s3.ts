import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.BLEMARKET_AWS_REGION,
  accessKeyId: process.env.BLEMARKET_AWS_ACCESS_KEY,
  secretAccessKey: process.env.BLEMARKET_AWS_SECRET_KEY,
});

const S3 = new AWS.S3();

export default S3;
