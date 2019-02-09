FROM node:10.15-alpine

COPY . /root/app
WORKDIR /root/app

RUN apk update && apk add git jq
RUN yarn && yarn build
RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

CMD yarn start
