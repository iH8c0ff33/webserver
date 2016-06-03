FROM alpine

ENV DBPATH 'var/lib/postgresql'

RUN apk add --update postgresql
RUN mkdir -p $DBPATH && \
  chown postgres:postgres $DBPATH

USER postgres
RUN initdb -E UTF8 -D $DBPATH/data && \
  postgres -D $DBPATH/data&sleep 1 && \
  createuser www && \
  createdb -O www webserver && \
  killall postgres && \
  sed -i s/'127.0.0.1\/32'/'0.0.0.0\/0'/ $DBPATH/data/pg_hba.conf

EXPOSE 5432
CMD postgres -h 0.0.0.0 -p 5432 -D $DBPATH/data
