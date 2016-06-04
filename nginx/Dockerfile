FROM alpine

ENV REPO 'http://nl.alpinelinux.org/alpine/edge/main'

RUN apk add --update -X $REPO nginx

ADD proxy.conf /etc/nginx/conf.d/proxy.conf

CMD sh
