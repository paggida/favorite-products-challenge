FROM node:12-alpine AS builder

WORKDIR /home/node/build

COPY package.json yarn.* ./

RUN yarn

COPY . .

RUN yarn build


FROM node:12-alpine AS build

WORKDIR /home/node/api/

RUN yarn global add pm2

COPY --from=builder /home/node/build/node_modules ./node_modules
COPY --from=builder /home/node/build/process.yml .
COPY --from=builder /home/node/build/package.json .
COPY --from=builder /home/node/build/dist ./src

EXPOSE 3000

CMD ["pm2-runtime", "process.yml"]
