import CleanupService from "./services/cleanup_service";
import JobService from "./services/job_service";

require('dotenv').config();

async function main() {
    const job_service = new JobService();
    await job_service.runJobs();

    const cleanup_service = new CleanupService();
    await cleanup_service.runCleanup();
}

main();