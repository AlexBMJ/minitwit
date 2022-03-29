# Minitwit

[![version](https://img.shields.io/github/v/release/AlexBMJ/minitwit?logo=Docker&style=for-the-badge)](https://github.com/AlexBMJ/minitwit/pkgs/container/minitwit)
[![upstatus](https://img.shields.io/website?down_color=darkred&down_message=offline&style=for-the-badge&up_message=online&logo=Firefox%20Browser&logoColor=white&url=http%3A%2F%2Fminitwit.waygroup.net)](http://minitwit.waygroup.net)
[![codecov](https://img.shields.io/codecov/c/github/AlexBMJ/minitwit?color=dark&logo=Codecov&logoColor=white&style=for-the-badge&token=UV548SE99L)](https://app.codecov.io/gh/AlexBMJ/minitwit/)
![GitHub branch checks state](https://img.shields.io/github/checks-status/AlexBMJ/minitwit/main?logo=GitHub&style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/AlexBMJ/minitwit?label=Pull%20Requests&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/AlexBMJ/minitwit?style=for-the-badge)

<!---
[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff&style=for-the-badge)](https://www.typescriptlang.org/)
[![NextJS](https://img.shields.io/badge/--3178C6?logo=Next.js&logoColor=black&color=white&style=for-the-badge)](https://www.typescriptlang.org/)
--->

## Setup Continuous Deployment

A new docker image is built when a new release is published using Github Actions and the docker stack is managed by [shepherd](https://github.com/djmaze/shepherd) which checks for new docker versions every five minutes.

### .ENV

```
MONGO_INITDB_ROOT_PASSWORD=changeme
MONGO_INITDB_ROOT_USERNAME=dbuser
MONGO_INITDB_DATABASE=minitwit
CONNECTION_STRING=mongodb://changeme:changeme@localhost:27017/minitwit?authSource=admin
TOKEN_SECRET=changeme
ELASTIC_VERSION=8.1.1
KIBANA_SYSTEM_PASSWORD=changeme
ELASTIC_PASSWORD=changeme
LOGSTASH_INTERNAL_PASSWORD=changeme
KIBANA_SYSTEM_PASSWORD=changeme
ELASTICSEARCH_PASSWORD=changeme
KIBANA_PASSWORD=changeme
```

### DEPLOY DOCKER STACK

`sudo docker swarm init`

`sudo docker stack deploy -c deployment.yml minitwit` with [deployment.yml](/deployment.yml)
