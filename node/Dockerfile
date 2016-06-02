FROM alpine

RUN apk add --update nodejs; \
  mkdir -p /var/app
WORKDIR /var/app

EXPOSE 3000

ENTRYPOINT ["npm", "install"]
CMD ["node", "app.js"]
