import AWS from 'aws-sdk';
import { execSync } from 'child_process';
import os from 'os';

export default class StorageService {
    bucket: string;
    constructor(region: string, accessKeyId: string, secretAccessKey: string, bucket: string) {
        AWS.config.update({
            region,
            accessKeyId,
            secretAccessKey
        });

        this.bucket = bucket;
    }

    async uploadFile(path: string, key: string) {
        const s3 = new AWS.S3();

        try {
            const params = {
                Bucket: this.bucket,
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
            Bucket: this.bucket
        };

        const objects = await s3.listObjectsV2(params).promise();
        let size = 0;

        for (const object of objects.Contents) {
            size += object.Size;
        }

        return size;
    }

    async listOlderFiles(days = 7) {
        const s3 = new AWS.S3();
        const params = {
            Bucket: this.bucket
        };

        const objects = await s3.listObjectsV2(params).promise();
        const now = new Date();
        const threshold = new Date(now.setDate(now.getDate() - days));
        const keys = [];

        for (const object of objects.Contents) {
            if (object.LastModified < threshold) {
                keys.push(object.Key);
            }
        }

        return keys;
    }

    async deleteS3File(key: string) {
        const s3 = new AWS.S3();
        const params = {
            Bucket: this.bucket,
            Key: key
        };

        await s3.deleteObject(params).promise();
    }

    async clearTmp() {
        console.log('Clearing tmp folder');
        const path = 'tmp/*';

        const command = os.platform() === 'win32' ? `rmdir /s /q ${path}` : `rm -rf ${path}`;
        execSync(command);
    }
}