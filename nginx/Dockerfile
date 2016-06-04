FROM alpine

ENV REPO 'http://nl.alpinelinux.org/alpine/edge/main'

RUN apk add --update -X $REPO nginx && \
  mkdir -p /run/nginx/

ADD nginx.conf /etc/nginx/nginx.conf
ADD proxy.conf /etc/nginx/conf.d/proxy.conf

CMD nginx -g 'daemon off;'
