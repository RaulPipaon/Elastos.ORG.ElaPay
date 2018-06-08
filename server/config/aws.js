import AWS from 'aws-sdk';
import bluebird from 'bluebird';
import { AWS as AWS_CONFIG } from './config';

AWS.config.setPromisesDependency(bluebird);
AWS.config.update({
    region: AWS_CONFIG.region,
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
});

export default AWS
