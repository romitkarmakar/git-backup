import AWS from 'aws-sdk';
import { execSync } from 'child_process';
import os from 'os';
import HelperService from './helper_service';

export default class StorageService {
    setup() {
        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
    }

    async uploadFile(path: string, key: string) {
        const s3 = new AWS.S3();

        try {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Body: require('fs').createReadStream(path)
            };

            return s3.upload(params).promise();
        } catch (error) {
            console.error(error);
        }
    }

    async calculateBucketSize() {
        const s3 = new AWS.S3();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME
        };

        const objects = await s3.listObjectsV2(params).promise();
        let size = 0;

        for (const object of objects.Contents) {
            size += object.Size;
        }

        return size;
    }

    async clearTmp() {
        console.log('Clearing tmp folder');
        const path = 'tmp/*';

        const command = os.platform() === 'win32' ? `rmdir /s /q ${path}` : `rm -rf ${path}`;
        execSync(command);
    }
}