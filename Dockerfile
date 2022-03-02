FROM node:16-alpine

RUN apk add --update --no-cache tzdata

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn build

CMD [ "yarn", "run", "start" ]
