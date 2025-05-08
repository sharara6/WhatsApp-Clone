# Notification Service

A microservice for handling real-time notifications in the WhatsApp Clone application using RabbitMQ as message broker.

## Features

- Real-time notifications via Socket.IO
- Message queue processing with RabbitMQ
- REST API for publishing notifications

## Prerequisites

- Node.js (v16+)
- RabbitMQ server
- Docker (for containerization)

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5003

# RabbitMQ Configuration
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## API Endpoints

### POST /api/notifications/publish

Publishes a notification to a specific user.

**Request Body:**

```json
{
  "receiverId": "user123",
  "senderId": "user456",
  "type": "message",
  "content": "You received a new message"
}
```

**Response:**

```json
{
  "message": "Notification published successfully",
  "notification": {
    "receiverId": "user123",
    "senderId": "user456",
    "type": "message",
    "content": "You received a new message",
    "timestamp": "2023-05-08T17:45:36.123Z"
  }
}
```

## Socket.IO Events

### Client-to-Server

- `register`: Client registers with their user ID
  ```javascript
  socket.emit("register", "user123");
  ```

### Server-to-Client

- `notification`: Server sends a notification to the client
  ```javascript
  // Structure of received notification
  {
    type: 'message',
    senderId: 'user456',
    content: 'You received a new message',
    timestamp: '2023-05-08T17:45:36.123Z'
  }
  ```

## Setting up RabbitMQ

### Using Docker

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

This will start a RabbitMQ instance with:

- AMQP port: 5672
- Management interface: http://localhost:15672 (guest/guest)

### Native Installation

Follow the [official RabbitMQ installation guide](https://www.rabbitmq.com/download.html) for your operating system.
