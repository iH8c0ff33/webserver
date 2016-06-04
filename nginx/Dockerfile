FROM alpine

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> \
  /etc/apk/repositories && \
  apk add --update nginx

ADD proxy.conf /etc/nginx/conf.d/proxy.conf

CMD sh
