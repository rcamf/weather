FROM node:12 AS builder

WORKDIR /usr/src/website

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx

COPY --from=builder /usr/src/website/dist/website /usr/share/nginx/html