require('dotenv').config();

import GithubService from "./services/github_service";
import HelperService from "./services/helper_service";
import StorageService from "./services/storage_service";

const githubService = new GithubService();
const storageService = new StorageService();

async function main() {
    await storageService.setup();
    const github_org = process.env.GITHUB_ORG as string;

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

                const s3_path = `${github_org}/${HelperService.getTodayDate()}/${repo.name}-${branch.name}.tar.gz`;
                await storageService.uploadFile(path, s3_path);
                console.log(`Uploaded to S3: ${s3_path}`);

                await githubService.deleteDownloadPath(path);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        await storageService.clearTmp();
    }
}

main();