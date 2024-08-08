FROM node:18.20-bookworm

RUN apt-get add wget -y
RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian12-x86_64-100.10.0.deb -O /tmp/mongodb-database-tools.deb
RUN dpkg -i /tmp/mongodb-database-tools.deb
RUN rm /tmp/mongodb-database-tools.deb

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]