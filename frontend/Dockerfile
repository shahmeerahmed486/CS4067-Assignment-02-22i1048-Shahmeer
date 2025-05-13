# Use a lightweight Node.js image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy env file before build
COPY .env.local .env.local

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Use a lightweight server for serving the built app
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
