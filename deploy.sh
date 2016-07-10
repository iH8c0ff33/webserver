#!/bin/bash
docker build -t webserver_node_image /var/src/webserver/node || \
    (echo " ERR: node build failed" && \
    exit 1)
docker build -t webserver_db_image /var/src/webserver/db || \
    (echo "ERR: db build failed" && \
    exit 1)
docker inspect webserver_db &> /dev/null && \
    docker kill webserver_db && docker rm webserver_db || \
    echo "webserver_db seems to be already stopped"
docker create \
    --restart always \
    -i -t \
    --name webserver_db \
    webserver_db_image
docker inspect webserver_node &> /dev/null && \
    docker kill webserver_node && docker rm webserver_node || \
    echo "webserver_node seems to be already stopped"
docker create \
    --restart always \
    -i -t \
    --name webserver_node \
    --link webserver_db:database \
    -p 2765:2765 \
    webserver_node_image
docker start webserver_db
docker start webserver_node
