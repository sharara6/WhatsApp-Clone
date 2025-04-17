# WhatsApp Clone API Gateway

Production-ready API Gateway for the WhatsApp Clone microservices architecture.

## Features

- ✅ Environment validation
- 🔐 JWT authentication
- 🛡️ Restricted CORS and payload validation
- 🔄 Circuit breaker and retry patterns
- 📊 Structured logging
- 🧰 API versioning
- 📝 Request payload validation
- 💾 Redis-backed rate limiting and caching

## Project Structure

The project is organized into a modular structure for better maintainability:

```
API_Gateway/
├── src/
│   ├── config/          # Configuration modules
│   │   ├── env.js       # Environment validation
│   │   ├── logger.js    # Logging configuration
│   │   └── redis.js     # Redis client setup
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── cache.js     # Caching middleware
│   │   ├── error-handlers.js # Error handling middleware
│   │   └── rate-limit.js # Rate limiting middleware
│   ├── routes/          # Route definitions
│   │   ├── health.js    # Health check routes
│   │   └── proxy.js     # Service proxy routes
│   ├── services/        # Service-related code
│   │   └── circuit-breaker.js # Circuit breaker logic
│   ├── utils/           # Utility functions
│   │   └── retry.js     # Retry logic
│   ├── websocket/       # WebSocket handling
│   │   └── ws-server.js # WebSocket server setup
│   ├── app.js           # Express app setup
│   └── server.js        # Server initialization
└── index.js             # Application entry point
```

## Setup

### Prerequisites

- Node.js 18+
- Redis server

### Environment Variables

Copy the `.env.example` file to `.env` and fill in your configuration values:

```bash
cp .env.example .env
```

All environment variables are validated at startup. The application will exit if any required variables are missing or invalid.

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Start in production mode
npm start
```

### Security Notes

- Never commit `.env` files with real secrets
- In production, use a secrets manager like AWS Secrets Manager or HashiCorp Vault
- TLS should be terminated either at the load balancer level or configured in the application

## Architecture

The API Gateway serves as the entry point for all client requests, directing them to the appropriate microservices:

- `/v1/auth` - Authentication Service
- `/v1/users` - User Service
- `/v1/chats` - Chat Service
- `/v1/message` - Message Service
- `/v1/media` - Media Service

## For Microservice Developers

### How to Connect Your Microservice to the Gateway

The API Gateway routes traffic to microservices based on the URL path prefix. Here's how to ensure your microservice works with the gateway:

#### 1. Registration

Microservices are registered in the gateway via environment variables:

```
# In the gateway's .env file
YOUR_SERVICE_URL=http://localhost:5006
```

Then register your service route in `src/routes/proxy.js`:

```javascript
const services = [
  // Add your new service
  {
    route: `${API_VERSION}/your-service`,
    target: env.YOUR_SERVICE_URL,
    validations: yourValidationSchemas,
  },
];
```

#### 2. API Endpoints

When designing your microservice API:

- All routes are prefixed with `/v1/your-service/...`
- The gateway strips the `/v1/your-service` prefix before forwarding to your service
- Example: Client calls `/v1/your-service/resource`, your service receives `/resource`

#### 3. Authentication

- The API Gateway handles JWT authentication for ALL routes
- Your microservice will receive the authenticated user's information in the request:
  - `req.user` contains the decoded JWT payload with user information
  - Your service should NOT implement its own authentication

#### 4. Request/Response Format

Use consistent request/response formats across all microservices:

```javascript
// Success response format
{
  code: 200, // HTTP status code
  status: "Success",
  message: "Operation successful",
  data: { ... } // Your response data
}

// Error response format
{
  code: 400, // HTTP status code
  status: "Error",
  message: "Validation failed",
  data: null
}
```

#### 5. Validation

- Define validation schemas for your endpoints in the gateway's `src/routes/proxy.js`
- Follow the existing pattern using Joi and celebrate:

```javascript
const yourValidationSchemas = {
  "/endpoint": celebrate({
    [Segments.BODY]: Joi.object({
      field: Joi.string().required(),
    }),
  }),
};
```

#### 6. Testing Your Integration

To test if your microservice is properly integrated:

1. Start your microservice on its designated port
2. Start the API Gateway
3. Send requests to the gateway endpoint (e.g., `http://localhost:5000/v1/your-service/endpoint`)
4. Verify that requests are forwarded correctly and responses maintain the expected format

#### 7. WebSocket Support

For real-time features:

- WebSocket connections from clients are established through the gateway
- To use WebSockets, include the JWT token as a query parameter: `ws://gateway/your-service?token=jwt-token`
- For custom WebSocket handling, modify `src/websocket/ws-server.js`

### Health Checks

Ensure your microservice exposes a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "service": "your-service-name"
}
```

## Health Check

The `/health` endpoint provides a health check for the gateway and its Redis dependency.
