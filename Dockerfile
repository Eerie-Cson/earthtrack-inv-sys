  FROM node:22.14-alpine AS base

  WORKDIR /home/node/app
  COPY package.json .
  COPY package-lock.json .
  COPY ./scripts ./scripts

  RUN npm install

  COPY ./dist ./service


  FROM node:22.14-alpine AS runner
  COPY --from=base /home/node/app /home/node/app

  WORKDIR /home/node/app
