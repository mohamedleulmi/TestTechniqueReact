FROM node:20

WORKDIR /app

COPY package*.json ./

COPY ./resources ./resources

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]