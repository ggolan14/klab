# Step 1: Build React app
FROM node:18 as build
WORKDIR /app
COPY client ./client
WORKDIR /app/client


COPY client/.env .env

RUN npm install && npm run build

# Step 2: Setup Node.js server
FROM node:18
WORKDIR /app

COPY server ./server
COPY --from=build /app/client/build ./server/client/build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]
