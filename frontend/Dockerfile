FROM node

WORKDIR /frontend

COPY my-app .

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 3010
