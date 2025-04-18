# Video Compression Microservice

A microservice for compressing video files using FFmpeg, built for the WhatsApp Clone project.

## Overview

This service provides a simple HTTP API for video compression, designed to reduce video file sizes before storing or sharing them within the application. It uses FFmpeg with libx264 encoding for high-quality compression while maintaining reasonable video quality.

## Features

- Video compression using H.264 codec
- Configurable compression ratio via CRF (Constant Rate Factor)
- Health check endpoint for monitoring
- CORS support for integration with API Gateway
- Environment-based configuration

## Prerequisites

- Go 1.16 or higher
- FFmpeg installed on the system
- Access to file system for reading and writing video files

## Installation

1. Clone the repository
2. Navigate to the service directory
3. Copy the environment example file:

```bash
cp .env.example .env
```

4. Modify the `.env` file to match your requirements
5. Build and run the service:

```bash
go build -o video-compression-service
./video-compression-service
```

## Configuration

The service is configured using environment variables, which can be set in the `.env` file:

| Variable                    | Description                                      | Default Value                               |
| --------------------------- | ------------------------------------------------ | ------------------------------------------- |
| PORT                        | Server port                                      | 8080                                        |
| ALLOWED_ORIGINS             | CORS allowed origins (comma-separated)           | http://localhost:5000,http://localhost:3000 |
| DEFAULT_CRF                 | Default compression quality (0-51, lower=better) | 28                                          |
| MAX_CONCURRENT_COMPRESSIONS | Maximum concurrent compressions                  | 4                                           |
| LOG_LEVEL                   | Logging level                                    | info                                        |

## API Endpoints

### Compress Video

Compresses a video file using the configured settings.

**URL**: `/compress`

**Method**: `POST`

**Body**:

```json
{
  "input_path": "/path/to/input/video.mp4",
  "output_path": "/path/to/output/compressed.mp4"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Video compressed successfully"
}
```

**Error Response**:

```json
{
  "success": false,
  "message": "Failed to compress video",
  "error": "input file does not exist: /path/to/input/video.mp4"
}
```

### Health Check

Returns the health status of the service.

**URL**: `/health`

**Method**: `GET`

**Success Response**:

```json
{
  "status": "healthy",
  "timestamp": "2023-08-15T12:34:56Z"
}
```

**Error Response**:

```json
{
  "status": "unhealthy: ffmpeg not found",
  "timestamp": "2023-08-15T12:34:56Z"
}
```

## Integration with API Gateway

This service is designed to work with the project's API Gateway. The API Gateway routes requests to this service using the path `/v1/video-compression`.

To use it through the API Gateway:

1. Ensure the API Gateway is configured with the correct service URL in its `.env` file:

```
VIDEO_COMPRESSION_SERVICE_URL=http://localhost:8080
```

2. Make requests to the API Gateway endpoint:

```
POST /v1/video-compression/compress
```

## Development

### File Structure

- `main.go` - Application entry point and server setup
- `compression.go` - Video compression logic
- `handlers.go` - HTTP request handlers
- `models.go` - Data structures

## License

This project is part of the WhatsApp Clone application and is subject to its licensing terms.
