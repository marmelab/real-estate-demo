FROM node:26-alpine AS base

ENV HUSKY=0

RUN apk upgrade --no-cache && apk add --no-cache curl

RUN npm install -g pnpm

RUN mkdir -p /app/packages && chown node:node /app /app/packages
USER node

ADD --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
ADD --chown=node:node packages/frontend-remix/package.json /app/packages/frontend-remix/

WORKDIR /app/packages/frontend-remix

RUN pnpm -F "@remix-v3-demo/frontend-remix..." install --frozen-lockfile

ADD --chown=node:node tsconfig.base.json /app/
ADD --chown=node:node packages/frontend-remix /app/packages/frontend-remix

FROM base AS dev

CMD ["pnpm", "-F", "@remix-v3-demo/frontend-remix", "dev"]

FROM base AS prod

RUN pnpm -F @remix-v3-demo/frontend-remix build

ENV PORT=8080

CMD ["pnpm", "-F", "@remix-v3-demo/frontend-remix", "start"]
