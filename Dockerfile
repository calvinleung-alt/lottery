FROM node:18 as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/public ./public

EXPOSE 8080
CMD ["node", "./dist/index.js"]