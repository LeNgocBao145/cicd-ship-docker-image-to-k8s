FROM node:24-alpine AS build
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
