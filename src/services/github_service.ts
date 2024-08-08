import axios from "axios"
import { IGithubRepository } from "../models/github_model"

export default class GithubService {
    github_token: string
    BASE_URL = "https://api.github.com"

    constructor(github_token: string) {
        this.github_token = github_token
    }

    getHeaders() {
        return {
            "Authorization": `Bearer ${this.github_token}`,
            "X-Github-Api-Version": "2022-11-28"
        }
    }

    async testConnection() {
        const url = `${this.BASE_URL}/octocat`

        const response = await axios.get(url, { headers: this.getHeaders() })
        return response.data
    }

    async getOrgRepositories(org: string): Promise<IGithubRepository[]> {
        const url = `${this.BASE_URL}/orgs/${org}/repos`
        const headers = {
            ...this.getHeaders(),
            "Accept": "application/vnd.github.v3+json"
        }

        const response = await axios.get(url, { headers })
        return response.data
    }

    async getRepoBranches(repo_slug: string) {
        const url = `${this.BASE_URL}/repos/${repo_slug}/branches`
        const headers = {
            ...this.getHeaders(),
            "Accept": "application/vnd.github.v3+json"
        }

        const response = await axios.get(url, { headers })
        return response.data
    }

    async downloadRepo(repo_slug: string, branch: string, path: string) {
        const url = `${this.BASE_URL}/repos/${repo_slug}/tarball/${branch}`
        const headers = {
            ...this.getHeaders(),
            "Accept": "application/vnd.github.v3+json"
        }
        this.createDownloadPath(path)

        const response = await axios.get(url, { headers, responseType: "stream" })
        response.data.pipe(require("fs").createWriteStream(path))

        return new Promise((resolve, reject) => {
            response.data.on("end", () => resolve(0))
            response.data.on("error", (error: any) => reject(error))
        })
    }

    createDownloadPath(path: string) {
        const pathParts = path.split("/")
        if (pathParts.length > 1) {
            // Generate the folder structure
            pathParts.pop()
            const folderPath = pathParts.join("/")
            require("fs").mkdirSync(folderPath, { recursive: true })
        }
    }

    deleteDownloadPath(path: string) {
        try {
            if (require("fs").existsSync(path)) {
                require("fs").unlinkSync(path)
                console.log(`Deleted ${path}`)
            }
        } catch (error) {
            console.error(error)
        }
    }
}