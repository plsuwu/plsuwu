FROM node:current-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

CMD ["node", "build"]

EXPOSE 3000
