FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5003
ENV RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
ENV FRONTEND_URL=http://localhost:5173

# Expose the port
EXPOSE 5003

# Run the application
CMD ["node", "src/index.js"] 