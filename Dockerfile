FROM node:10.15-alpine

COPY . /root/app
WORKDIR /root/app
RUN yarn && yarn build
CMD yarn start
