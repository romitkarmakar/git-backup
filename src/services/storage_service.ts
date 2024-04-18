import AWS from 'aws-sdk';

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
}