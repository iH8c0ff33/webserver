#!/bin/bash
git pull
docker build -t webserver_node_image ./node
docker build -t webserver_db_image ./db
docker inspect webserver_db && \
    docker kill webserver_db && \
    docker rm webserver_db
docker create \
    --restart always \
    -i -t \
    --net webserver \
    --name webserver_db \
    webserver_db_image && \
    docker start webserver_db
docker inspect webserver_node && \
    docker kill webserver_node && \
    docker rm webserver_node
docker create \
    --restart always \
    -i -t \
    --net webserver \
    --name webserver_node \
    --link webserver_db:database \
    webserver_node_image && \
    docker start webserver_node
