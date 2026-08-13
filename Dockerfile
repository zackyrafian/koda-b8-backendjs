FROM node:alpine
WORKDIR /app
COPY ./package*.json .
RUN npm i
COPY . .
EXPOSE 8080
# CMD [ "node", "./src/index.js" ]
ENTRYPOINT ["sh", "-c", "npx sequelize-cli db:migrate && node ./src/index.js"]