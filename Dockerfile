FROM node:20-alpine

workdir /var/www/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
