FROM node:24-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .


