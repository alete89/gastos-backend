FROM node:lts-alpine

WORKDIR /usr/src/gastos

COPY ["package.json", "package-lock.json", "/usr/src/gastos/"]

RUN npm install

COPY [".", "/usr/src/gastos"]

CMD [ "npm", "run", "dev" ]

EXPOSE 9000