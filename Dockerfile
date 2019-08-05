FROM node:8-alpine

RUN npm install express

RUN npm install winston

RUN npm install dotenv

COPY .env.docker .env

COPY xendit-logger-app.js .

CMD node xendit-logger-app.js >> xendit-logger-app.out

EXPOSE 3001
