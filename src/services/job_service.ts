import { BackupJob, GitBackupInput, JobType, MongoBackupInput } from "../models/config_model";
import ConfigService from "./config_service";
import GithubService from "./github_service";
import HelperService from "./helper_service";
import MongoService from "./mongo_service";
import StorageService from "./storage_service";

export default class JobService {
    async runJobs() {
        // Create a /tmp directory if it doesn't exist
        HelperService.createTmpDir();
        
        const jobs = ConfigService.getJobs(JobType.git);
        for (const job of jobs) {
            switch ((job.input as GitBackupInput).host) {
                case 'github':
                    await this.runGithubJob(job);
                    break;
                default:
                    console.error('Unknown host');
                    break;
            }
        }

        const mongo_jobs = await ConfigService.getJobs(JobType.mongodb);
        for (const job of mongo_jobs) {
            await this.runMongoJob(job);
        }
    }

    async runGithubJob(job: BackupJob) {
        const output = job.output;
        const input = job.input as GitBackupInput;
        const storageService = new StorageService(output.region, output.access_key, output.secret_key, output.bucket);
        const githubService = new GithubService(input.token);
        const github_org = input.org;

        const bucket_size = await storageService.calculateBucketSize();
        console.log(`Current Bucket size: ${HelperService.formatSize(bucket_size)} bytes`);

        try {
            const response = await githubService.getOrgRepositories(github_org);
            for (const repo of response) {
                const branches = await githubService.getRepoBranches(repo.full_name);

                for (const branch of branches) {
                    console.log(`Repo: ${repo.full_name}, Branch: ${branch.name}`);
                    const path = `tmp/${repo.full_name}-${branch.name}.tar.gz`;

                    await githubService.downloadRepo(repo.full_name, branch.name, path);
                    console.log(`Downloaded to ${path}`);

                    const s3_path = `git/${github_org}/${HelperService.getTodayDate()}/${repo.name}-${branch.name}.tar.gz`;
                    await storageService.uploadFile(path, s3_path);
                    console.log(`Uploaded to S3: ${s3_path}`);

                    githubService.deleteDownloadPath(path);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            await storageService.clearTmp();
        }
    }

    async runMongoJob(job: BackupJob) {
        const output = job.output;
        const input = job.input as MongoBackupInput;
        const storageService = new StorageService(output.region, output.access_key, output.secret_key, output.bucket);
        const mongoService = new MongoService(input.host, 27017, input.username, input.password, input.uri, input.tunnel);

        try {
            const path = `tmp/${input.db_name}-${HelperService.getTodayDate()}.tar.gz`;
            await mongoService.dumpDatabase(path);
            console.log(`Database dumped to ${path}`);

            const s3_path = `mongo/${input.db_name}/${HelperService.getTodayDate()}.tar.gz`;
            await storageService.uploadFile(path, s3_path);
            console.log(`Uploaded to S3: ${s3_path}`);
        } catch (error) {
            console.error(error);
        } finally {
            await storageService.clearTmp();
        }
    }
}