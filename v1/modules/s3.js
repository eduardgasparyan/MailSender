import aws from 'aws-sdk';

export const s3 = new aws.S3({
    region: 'us-east-1',
});