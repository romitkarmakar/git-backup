import fs from 'fs';

export default class HelperService {
    static getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        return `${year}-${month}-${day}`;
    }

    static formatSize(bytes: number) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static createBatches(batch_size: number = 5, items: any[]) {
        const batches = [];
        let currentBatch = [];

        for (const item of items) {
            if (currentBatch.length === batch_size) {
                batches.push(currentBatch);
                currentBatch = [];
            }

            currentBatch.push(item);
        }

        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }

        return batches;
    }

    static createTmpDir() {
        if (!fs.existsSync('tmp')) {
            fs.mkdirSync('tmp');
        }
    }
}