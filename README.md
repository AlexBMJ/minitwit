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
MONGO_INITDB_ROOT_USERNAME="<username>"
MONGO_INITDB_ROOT_PASSWORD="<password>"
MONGO_INITDB_DATABASE="minitwit"
CONNECTION_STRING="mongodb://<username>:<password>@db:27017/minitwit?authSource=admin"
TOKEN_SECRET="<token secret>" 
```

### DEPLOY DOCKER STACK
`sudo docker stack init`

`sudo docker stack deploy -c deployment.yml minitwit` with [deployment.yml](/deployment.yml)
