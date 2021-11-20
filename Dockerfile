# syntax = docker/dockerfile:1.0.0-experimental

FROM node:14.17.5-bullseye-slim

ENV POSITION=Runtime \
    SERVICE=send-data-to-azure-iot-hub-nodejs \
    AION_HOME=/var/lib/aion

ENV TZ Asia/Tokyo

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    git \
    openssh-client \
    gnupg \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN mkdir /root/.ssh/ && touch /root/.ssh/known_hosts && ssh-keyscan -t rsa bitbucket.org >> /root/.ssh/known_hosts

RUN mkdir -p ${AION_HOME}/$POSITION/$SERVICE
WORKDIR ${AION_HOME}/$POSITION/$SERVICE

ADD package.json .
RUN --mount=type=secret,id=ssh,target=/root/.ssh/id_rsa yarn install

ADD . .
RUN yarn build

CMD ["yarn","start"]
