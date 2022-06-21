FROM node:latest
WORKDIR /app
COPY . /app

RUN npm install
