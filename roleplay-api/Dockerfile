FROM node:14
WORKDIR /usr/app/
COPY yarn.lock /usr/app/
RUN yarn install
COPY . .
EXPOSE 3333
CMD [ "node", "ace", "serve", "--watch" ]
