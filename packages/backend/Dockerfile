FROM node:14.17-alpine
LABEL maintainer "Mohamed El Amine DADDOU <mea.daddou@gmail.com>"

WORKDIR /home/node/app

# Update NPM
RUN npm install -g npm

COPY package.json .
RUN yarn install

COPY . .

EXPOSE ${PORT}

USER node