FROM node:18.19.0-alpine3.19

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

RUN addgroup --system smart-savings-api && \
          adduser --system -G smart-savings-api smart-savings-api && \
          chmod 750 ./start.sh

ENTRYPOINT "./start.sh"
