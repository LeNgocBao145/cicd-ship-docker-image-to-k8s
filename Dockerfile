FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM node:24-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
