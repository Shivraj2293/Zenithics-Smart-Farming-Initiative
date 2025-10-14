# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base

# --- Builder Stage ---
# This stage installs all dependencies and builds the app
FROM base AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# --- Production Stage ---
# This stage copies only the necessary files for a lean final image
FROM base AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json .

# Command to run the application
CMD ["node", "dist/main.js"]

