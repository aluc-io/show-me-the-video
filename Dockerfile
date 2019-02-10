FROM node:10.15-alpine

COPY src /root/app/src
COPY global.d.ts /root/app/global.d.ts
COPY next.config.js /root/app/next.config.js
COPY package.json /root/app/package.json
COPY tsconfig.json /root/app/tsconfig.json
COPY tsconfig.server.json /root/app/tsconfig.server.json
COPY .babelrc.js /root/app/.babelrc.js
RUN rm -rfv /root/app/src/.next
WORKDIR /root/app

ARG SMTV_VERSION
RUN yarn
ENV NODE_ENV=production
ENV SMTV_VERSION=$SMTV_VERSION
RUN yarn build

RUN apk update && apk add git jq
RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

CMD yarn start
