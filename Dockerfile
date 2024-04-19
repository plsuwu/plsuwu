FROM node:alpine

WORKDIR /plsuwu
COPY . .
RUN npm ci
RUN npm run build
CMD ["node", "build"]
EXPOSE 3000
