FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install --omit=dev

# Install dependencies
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set environment variables
ENV PORT=8084
ENV NODE_ENV=production
ENV PORT=8081

# Expose the port the app runs on
EXPOSE 8084

# Command to run the application
CMD ["npm", "start"]
