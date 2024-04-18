require('dotenv').config();

import GithubService from "./services/github_service";

const githubService = new GithubService();

async function main() {
    try {
        const response = await githubService.getOrgRepositories(process.env.GITHUB_ORG as string);
        for (const repo of response) {
            const branches = await githubService.getRepoBranches(repo.full_name);
            
            for (const branch of branches) {
                console.log(`Repo: ${repo.full_name}, Branch: ${branch.name}`);
                const path = `${repo.full_name}-${branch.name}.tar.gz`;
                await githubService.downloadRepo(repo.full_name, branch.name, path);
            }

            break;
        }
    } catch (error) {
        console.error(error);
    }
}

main();