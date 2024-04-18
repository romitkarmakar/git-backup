# Git Backup

Automated Github Backup System for Disaster Recovery. This system takes daily snapshots of the whole organisation code and store them into S3 as a backup storage which is easily searchable based on date wise directory structure.

## Installation

- Nodejs greater or equal to 16 must be installed

- Install the dependencies and copy the env file from the example file
```shell
yarn
cp .env.example .env
```
- Add the required environment file and then run the server
```
yarn dev
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