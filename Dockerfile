# Use the official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Create necessary directories
RUN mkdir -p logs uploads tmp

# Expose the port the app runs on
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Command to run the application
CMD ["node", "server.js"]
