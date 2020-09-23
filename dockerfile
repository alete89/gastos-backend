FROM node:lts-alpine

WORKDIR /usr/src/gastos

COPY package.json .

RUN npm install

ADD . /usr/src/gastos

CMD [ "npm", "run", "dev" ]

EXPOSE 9000