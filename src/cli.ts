import fs from 'fs';
import { parse } from 'yaml';

async function configYamlToJson() {
    const config_file = fs.readFileSync('config.yaml', 'utf8');
    const config_json = parse(config_file);

    console.log(`CONFIG_JSON='${JSON.stringify(config_json)}'`);
}

configYamlToJson();