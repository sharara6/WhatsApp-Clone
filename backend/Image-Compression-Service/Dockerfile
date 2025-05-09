FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy application code
COPY . .

# Set environment variables
ENV PORT=8084
ENV NODE_ENV=production
ENV PORT=8081

# Expose the port the app runs on
EXPOSE 8084

# Run the application
CMD ["node", "src/index.js"]