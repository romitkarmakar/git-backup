import { parse } from 'yaml'
import { readFileSync } from 'fs'
import BackupConfig from '../models/config_model'
import { JobType } from 'aws-sdk/clients/importexport';

export default class ConfigService {
    static config: BackupConfig;

    static async setConfig() {
        if (process.env.CONFIG_JSON) {
            ConfigService.config = JSON.parse(process.env.CONFIG_JSON)
            console.log(JSON.stringify(ConfigService.config, null, 2))
            return
        }

        const config_file = readFileSync('config.yaml', 'utf8')
        ConfigService.config = parse(config_file)

        console.log(JSON.stringify(ConfigService.config, null, 2))
    }

    static getRetentionPeriod() {
        return ConfigService.config.retention_days || 7
    }

    static getJobs(type: JobType | null = null) {
        if (!type) return ConfigService.config.jobs
        return ConfigService.config.jobs.filter(job => job.job_type === type)
    }
}