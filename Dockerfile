FROM node:alpine
WORKDIR /app
COPY ./package*.json .
RUN npm i
COPY . .
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "npx sequelize-cli db:migrate --config src/config/config.json --migrations-path src/migrations --models-path src/models && node ./src/index.js"]