FROM node:16.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5500

EXPOSE 5500

CMD ["npm","start"]