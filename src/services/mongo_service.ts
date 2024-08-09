import fs from 'fs';
import { execSync } from 'child_process';
import { SSLTunnelConfig } from '../models/config_model';

export default class MongoService {
    host: string;
    port: number;
    username: string;
    password: string;
    uri: string;
    tunnelConfig: SSLTunnelConfig | null;

    constructor(host: string, port: number, username: string, password: string, uri: string = "", tunnelConfig: SSLTunnelConfig | null) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.uri = uri;
        if (uri === "") {
            this.uri = `mongodb://${username}:${password}@${host}:${port}`;
        }

        this.tunnelConfig = tunnelConfig;
    }

    async dumpDatabase(path: string) {
        let commands = [];
        if (this.tunnelConfig) {
            const { username, host, private_key } = this.tunnelConfig;
            fs.writeFileSync('private_key.pem', private_key);

            commands = [
                `touch ${path}`,
                `chmod 400 private_key.pem`,
                `ssh -L 4321:${this.host}:${this.port} ${username}@${host} -i private_key.pem -f -N`,
                `mongodump --uri=mongodb://${this.username}:${this.password}@localhost:4321 --archive=${path} --gzip`
            ]
        } else {
            commands = [
                `touch ${path}`,
                `mongodump --uri=${this.uri} --archive=${path} --gzip`
            ]
        }

        try {
            const final_command = commands.join(' && ');
            execSync(final_command, { stdio: 'inherit' });
        } catch (error) {
            console.error(error);
        } finally {
            if (this.tunnelConfig) {
                execSync(`kill $(lsof -t -i:4321)`, { stdio: 'inherit' });
                execSync(`chmod 777 private_key.pem`, { stdio: 'inherit' });
                fs.unlinkSync('private_key.pem');
            }
        }

        console.log(`Database dumped to ${path}`);
    }
}