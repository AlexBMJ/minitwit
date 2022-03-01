FROM node:16-alpine

WORKDIR /usr/src/app

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "run", "dev" ]