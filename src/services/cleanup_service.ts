import { S3Output, JobType } from "../models/config_model";
import ConfigService from "./config_service";
import HelperService from "./helper_service";
import StorageService from "./storage_service";

export default class CleanupService {
    async runCleanup() {
        const jobs = await ConfigService.getJobs();
        for (const job of jobs) {
            if (job.job_type === JobType.gitMirror) {
                return;
            }
            console.log(`Running cleanup for job ${job.job_type}`);

            const output = job.output as S3Output;
            const storageService = new StorageService(output.region, output.access_key, output.secret_key, output.bucket);

            const keys = await storageService.listOlderFiles();
            const batches = HelperService.createBatches(5, keys);

            for (let i = 0; i < batches.length; i++) {
                console.log(`Deleting batch ${i + 1} / ${batches.length}`);
                const promises = batches[i].map(key => {
                    const new_storage_service = new StorageService(output.region, output.access_key, output.secret_key, output.bucket);
                    return new_storage_service.deleteS3File(key);
                });
                await Promise.all(promises);
            }
        }
    }
}