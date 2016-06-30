#!/bin/sh
docker build -t webserver_node_image ./node || \
    echo " ERR: node build failed" && \
    exit 1
docker build -t webserver_db_image ./db || \
    echo "ERR: db build failed" && \
    exit 1
docker inspect webserver_db &> /dev/null && \
    docker kill webserver_db && docker rm webserver_db || \
    echo "webserver_db seems to be already stopped"
docker create \
    --restart always \
    -i -t \
    --net webserver \
    --name webserver_db \
    webserver_db_image
docker inspect webserver_node &> /dev/null && \
    docker kill webserver_node && docker rm webserver_node || \
    echo "webserver_node seems to be already stopped"
docker create \
    --restart always \
    -i -t \
    --net webserver \
    --name webserver_node \
    --link webserver_db:database \
    webserver_node_image
docker start webserver_db
docker start webserver_node
