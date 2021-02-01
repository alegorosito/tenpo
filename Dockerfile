FROM node:14-slim

WORKDIR /app

COPY package.json /app

COPY src/ /app/src

RUN npm install

EXPOSE 3000

CMD ["npm","start"]
