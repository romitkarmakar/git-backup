export enum JobType {
    git = 'git',
    mongodb = 'mongodb'
}

export interface BackupJob {
    job_type: JobType
    input: Input
    output: Output
}

export enum GitInputHost {
    github = 'github',
    gitlab = 'gitlab'
}

export interface Input {
    host: GitInputHost
    org: string
    token: string
}

export enum StorageType {
    s3 = 's3',
    local = 'local'
}

export interface Output {
    storage: StorageType
    bucket: string
    region: string
    access_key: string
    secret_key: string
}

export default interface BackupConfig {
    retention_days: number
    jobs: BackupJob[]
}