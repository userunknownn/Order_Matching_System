FROM node

WORKDIR /backend

COPY application/package.json application/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY application .

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 3000
