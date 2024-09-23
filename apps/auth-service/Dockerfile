FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
CMD [ "node", "dist/apps/auth-service/main.js" ]