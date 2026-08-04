FROM node:alpine
WORKDIR /webservices 

COPY package*.json ./ 
RUN npm install 
COPY apps/api ./apps/api
EXPOSE 8080
CMD ["npm", "run", "dev"]

