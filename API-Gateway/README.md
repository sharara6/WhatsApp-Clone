# API Gateway

A centralized API Gateway for the WhatsApp Clone microservices architecture, handling routing, authentication, and rate limiting.

## Features

- Route requests to appropriate microservices
- Authentication with Keycloak integration
- Rate limiting to prevent abuse
- Request logging
- Docker support

## Services Behind the Gateway

- Video Compression Service: `/video-compression/*`
- Image Compression Service: `/image-compression/*`

## Running with Docker

The easiest way to run this service is with Docker:

```bash
# From the root directory, build and run all services:
docker-compose up --build

# Or build and run just the API Gateway:
cd API-Gateway
docker build -t api-gateway .
docker run -p 3000:3000 api-gateway
```

## Manual Setup

If you prefer to run without Docker:

### Requirements

- Node.js 16 or higher
- npm or yarn

### Installation

```bash
cd API-Gateway
npm install
```

### Running the Service

```bash
npm start
# or for development with auto-restart:
npm run dev
```

The gateway will start on port 3000 by default.

## Configuration

The gateway is configured in `routes.js`. Each route specifies:

- URL path
- Authentication requirement
- Rate limiting rules
- Target service

Example:

```javascript
{
    url: '/video-compression',
    auth: false,
    rateLimit: {
        windowMs: 60 * 1000,
        max: 5
    },
    proxy: {
        target: "http://video-compression-service:8080",
        changeOrigin: true,
        pathRewrite: {
            [`^/video-compression`]: '',
        },
    }
}
```

## Using the Gateway

To use the gateway, direct your client requests to:

```
http://localhost:3000/{service-path}/{endpoint}
```

For example, to compress a video:

```
POST http://localhost:3000/video-compression/compress
```

This will be routed to the Video Compression Service's `/compress` endpoint.
