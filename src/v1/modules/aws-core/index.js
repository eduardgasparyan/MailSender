import XRay from 'aws-xray-sdk-core';
import aws from 'aws-sdk';

// eslint-disable-next-line import/no-mutable-exports
let AWS;
if (process.env?.IS_OFFLINE) {
    AWS = aws;
} else {
    AWS = XRay.captureAWS(aws);
}

export default AWS;