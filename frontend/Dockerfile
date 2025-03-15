# Use a lightweight Node.js image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project and build it
COPY . .
RUN npm run build

# Use a lightweight server for serving the built app
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app ./

# Expose port for frontend
EXPOSE 3000

# Start the built frontend
CMD ["npm", "run", "start"]
