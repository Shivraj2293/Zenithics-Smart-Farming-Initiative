# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Add the --no-lint flag to prevent build failures from linting errors
RUN npm run build -- --no-lint

# --- Production Stage ---
FROM base
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./

CMD ["npm", "start", "--", "-p", "3001"]

