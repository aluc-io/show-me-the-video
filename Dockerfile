FROM node:10.15-alpine

# https://nickjanetakis.com/blog/docker-tip-47-build-time-vs-run-time-env-variables
ARG SMTV_VERSION
ENV SMTV_VERSION="${SMTV_VERSION}"

COPY src /root/app/src
COPY global.d.ts /root/app/global.d.ts
COPY next.config.js /root/app/next.config.js
COPY package.json /root/app/package.json
COPY tsconfig.json /root/app/tsconfig.json
COPY tsconfig.server.json /root/app/tsconfig.server.json
COPY .babelrc.js /root/app/.babelrc.js
WORKDIR /root/app

RUN rm -rfv /root/app/src/.next \
  && yarn install \
  && yarn build \
  && apk update \
  && apk add git jq \
  && yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")') \
  && apk del jq \
  && rm -rf /var/cache/apk/*

ENV NODE_ENV=production

CMD yarn start
