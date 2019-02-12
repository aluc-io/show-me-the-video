FROM node:10.15-alpine

COPY src /root/app/src
COPY global.d.ts /root/app/global.d.ts
COPY next.config.js /root/app/next.config.js
COPY package.json /root/app/package.json
COPY tsconfig.json /root/app/tsconfig.json
COPY tsconfig.server.json /root/app/tsconfig.server.json
COPY .babelrc.js /root/app/.babelrc.js
WORKDIR /root/app

ARG SMTV_VERSION
RUN rm -rfv /root/app/src/.next \
  && yarn install \
  && export SMTV_VERSION=$SMTV_VERSION \
  && export NODE_ENV=production \
  && yarn build \
  && apk update && apk add git jq \
  && yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")') \
  && apk remove jq

CMD yarn start
