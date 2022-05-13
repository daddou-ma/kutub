FROM node:14.17-alpine
LABEL maintainer "Mohamed El Amine DADDOU <mea.daddou@gmail.com>"

WORKDIR /home/node/app

COPY package.json .
RUN yarn install

COPY . .

EXPOSE ${PORT}

USER node

CMD yarn dev