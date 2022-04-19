# Minitwit

[![version](https://img.shields.io/github/v/release/AlexBMJ/minitwit?logo=Docker&style=for-the-badge)](https://github.com/AlexBMJ/minitwit/pkgs/container/minitwit)
[![upstatus](https://img.shields.io/website?down_color=darkred&down_message=offline&style=for-the-badge&up_message=online&logo=Firefox%20Browser&logoColor=white&url=http%3A%2F%2Fminitwit.waygroup.net)](http://minitwit.waygroup.net)
[![codecov](https://img.shields.io/codecov/c/github/AlexBMJ/minitwit?color=dark&logo=Codecov&logoColor=white&style=for-the-badge&token=UV548SE99L)](https://app.codecov.io/gh/AlexBMJ/minitwit/)
[![GitHub branch checks state](https://img.shields.io/github/checks-status/AlexBMJ/minitwit/main?logo=GitHub&style=for-the-badge)](https://github.com/AlexBMJ/minitwit/actions)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/AlexBMJ/minitwit?label=Pull%20Requests&style=for-the-badge)](https://github.com/AlexBMJ/minitwit/pulls)
[![GitHub](https://img.shields.io/github/license/AlexBMJ/minitwit?style=for-the-badge)](/LICENSE)

![https://nextjs.org/](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge) 
![https://www.typescriptlang.org/](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)

An application created for the 'DevOps, Software Evolution and Software Maintenance' course at ITU in Copenhagen. This application was refactored from the original minitwit project wrtiten in Python using flask.

Since then, it's been refactored to use TypeScript using modern DevOps features and practices:

- Continuously integrated using GitHub Actions, with automatic unit testing, static analysis and coverage reporting.
- Continuously delivered with automatic GitHub releases.
- Containerized using Docker.
- Logging support using Pino, ElasticSearch and Kibana.
- Performance monitoring using Promethus which is integrated through Grafana.

## Contribting

For contributing, please read the [CONTRIBUTING.md](/CONTRIBUTING.md) guide.

## Continuous Deployment

A new docker image is built when a new release is published using Github Actions and the docker stack is managed by [shepherd](https://github.com/djmaze/shepherd) which checks for new docker versions every five minutes.

## Set Up

1. Create the follownig `.env` file in the main directory:

  ```env
  MONGO_INITDB_ROOT_USERNAME=dbuser
  MONGO_INITDB_ROOT_PASSWORD=changeme
  MONGO_INITDB_DATABASE=minitwit
  CONNECTION_STRING=mongodb://changeme:changeme@db:27017/minitwit?authSource=admin
  TOKEN_SECRET=changeme
  KIBANA_SYSTEM_PASSWORD=changeme
  ELASTIC_PASSWORD=changeme
  LOGSTASH_INTERNAL_PASSWORD=changeme
  ELASTICSEARCH_PASSWORD=changeme
  KIBANA_PASSWORD=changeme
  ```

### Deployment

```pwsh
sudo docker swarm init
sudo docker stack deploy -c deployment.yml minitwit
```

with [deployment.yml](/deployment.yml)

## Maintainers

- Alexander Bastian Magno Jacobsen
- Anton Marius Nielsen
- Deniz Isik
- Deniz Yildirim
- Mikkel Lindgreen Bech
