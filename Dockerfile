FROM node:18.18-alpine3.17

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]