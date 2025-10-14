# --- Base Stage ---
FROM node:20-alpine AS base

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Build production assets
RUN npm run build

# --- Production Stage ---
FROM base AS production
WORKDIR /usr/src/app

# Install a simple static server
RUN npm install -g serve

# Copy only built assets and package files
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./

# Expose the port that 'serve' will use
EXPOSE 5173

# Run the production server
CMD ["serve", "-s", "dist", "-l", "5173"]
