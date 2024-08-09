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

export type Input = GitBackupInput | MongoBackupInput

export interface GitBackupInput {
    host: GitInputHost
    org: string
    token: string
}

export interface MongoBackupInput {
    host: string
    username: string
    password: string
    uri: string
    db_name: string
    tunnel: SSLTunnelConfig | null
}

export interface SSLTunnelConfig {
    username: string;
    host: string;
    private_key: string;
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