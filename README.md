# Git Backup

Automated Github Backup System for Disaster Recovery. This system takes daily snapshots of the whole organisation code and store them into S3 as a backup storage which is easily searchable based on date wise directory structure.

## Installation

- Nodejs greater or equal to 16 must be installed

- Install the dependencies and copy the env file from the example file
```shell
yarn
```
- Add the required environment file and then run the server
```
yarn dev
```

## Configuration

Create a `config.yaml` file in the root directory of the project with the following content
```yaml
retention_days: 7
jobs:
  - job_type: "git"
    input:
      host: "github"
      org: "<github_org_name>"
      token: "<github_personal_access_token>"
    output:
      storage: "s3"
      bucket: ""
      region: ""
      access_key: ""
      secret_key: ""
```
To deploy the project on platforms like Docker, Heroku, or Railway, you can set the environment variables instead of creating the `config.yaml` file.

- Convert any `.pem` file to a single line string to set it in the config
```shell
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private.pem
```

- Run this command to get the environment variable which will convert the yaml to env
```shell
yarn convert-to-json
```

- You will get a environment variable will output similar to this
```shell
CONFIG_JSON=''
```

- Copy the output and set the environment variable in the platform where you are deploying the project

## Configuration for MongoDB Backup
```yaml
- job_type: "mongodb"
    input:
      host: "<mongodb_host>"
      username: "<mongodb_username>"
      password: "<mongodb_password>"
      db_name: "<mongodb_db_name>"
      tunnel:
        username: "<ssh_username>"
        host: "<ssh_host>"
        private_key: "<private_key in pem format>"
    output:
      storage: "s3"
      bucket: "<s3_bucket>"
      region: "<s3_region>"
      access_key: "<s3_access_key>"
      secret_key: "<s3_secret_key>"
```

## Configuration for Git Mirroring
```yaml
- job_type: "git-mirror"
    input:
      repo_url: "<repo_url>"
      git_username: "<git_username>"
      git_password: "<git_password / personal_access_token>"
    output:
      repo_url: "<repo_url>"
      git_username: "<git_username>"
      git_password: "<git_password / personal_access_token>"
```

## AWS Setup

Minimal AWS Policy for the IAM User
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:Describe*",
                "s3:Put*",
                "s3:Delete*",
                "s3-object-lambda:Get*",
                "s3-object-lambda:List*"
            ],
            "Resource": [
                "arn:aws:s3:::<mybucket>",
                "arn:aws:s3:::<mybucket>/*"
            ]
        }
    ]
}
```

## Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/HgR-fs?referralCode=_1lQet)