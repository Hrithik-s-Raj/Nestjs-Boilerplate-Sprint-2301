FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn target_arch=x64 --target_platform=linux

COPY . ./

RUN yarn build

ENV PORT 8000

EXPOSE $PORT

CMD ["yarn"]