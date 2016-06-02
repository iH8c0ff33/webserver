FROM alpine

RUN apk add --update nodejs; \
  mkdir -p /var/app
WORKDIR /var/app

EXPOSE 3000

CMD npm install; node app.js
