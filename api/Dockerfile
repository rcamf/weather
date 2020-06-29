FROM node:12

WORKDIR /usr/src/api

COPY ./api/package*.json ./

RUN npm install

COPY ./api . 

EXPOSE 8080

CMD [ "npm", "start" ]
