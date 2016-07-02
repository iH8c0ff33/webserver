FROM alpine
MAINTAINER Daniele Monteleone <daniele.monteleone.it@gmail.com>

RUN apk add --update nodejs && \
    mkdir -p /tmp/node
ADD package.json /tmp/node/package.json
RUN cd /tmp/node && \
    npm install
RUN mkdir -p /src && \
    cp -a /tmp/node/node_modules /src/ && \
    rm -rf /tmp/node

WORKDIR /src
ADD src /src

EXPOSE 2765

CMD node /src/app.js
