FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY server.js .
RUN npm install express
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"] 