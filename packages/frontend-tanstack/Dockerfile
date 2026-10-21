FROM node:26-alpine AS base

ENV HUSKY=0

RUN apk upgrade --no-cache && apk add --no-cache curl

RUN npm install -g pnpm

RUN mkdir -p /app/packages && chown node:node /app /app/packages
USER node

ADD --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
ADD --chown=node:node packages/frontend-tanstack/package.json /app/packages/frontend-tanstack/

WORKDIR /app/packages/frontend-tanstack

RUN pnpm -F "@remix-v3-demo/frontend-tanstack..." install --frozen-lockfile

ADD --chown=node:node tsconfig.base.json /app/
ADD --chown=node:node packages/frontend-tanstack /app/packages/frontend-tanstack

FROM base AS dev

CMD ["pnpm", "-F", "@remix-v3-demo/frontend-tanstack", "dev"]

FROM base AS build

RUN pnpm -F @remix-v3-demo/frontend-tanstack build

FROM node:26-alpine AS prod

RUN apk upgrade --no-cache && apk add --no-cache curl

WORKDIR /app

ENV PORT=8080

COPY --from=build /app/packages/frontend-tanstack/.output /app/.output

USER node

CMD ["node", ".output/server/index.mjs"]
