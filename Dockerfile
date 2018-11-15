FROM node:8

WORKDIR /app

COPY ./package*.json ./
RUN npm install --only=production && npm cache clean --force

COPY ./app/ .

CMD [ "node", "index.js" ]