import ConfigService from "./config_service";
import HelperService from "./helper_service";
import StorageService from "./storage_service";

export default class CleanupService {
    async runCleanup() {
        const jobs = await ConfigService.getJobs();
        for (const job of jobs) {
            const output = job.output;
            const storageService = new StorageService(output.region, output.access_key, output.secret_key, output.bucket);

            const keys = await storageService.listOlderFiles();
            const batches = HelperService.createBatches(5, keys);

            for (let i = 0; i < batches.length; i++) {
                console.log(`Deleting batch ${i + 1} / ${batches.length}`);
                const promises = batches[i].map(storageService.deleteS3File);
                await Promise.all(promises);
            }
        }
    }
}