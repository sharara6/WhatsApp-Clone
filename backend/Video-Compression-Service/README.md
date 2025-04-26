# Video Compression Service

A microservice for compressing video files using FFmpeg with configurable quality settings.

## Features

- HTTP API for video compression
- Configurable compression quality (CRF 0-51)
- In-memory video processing
- Integration with API Gateway
- Health check endpoint
- Docker support

## Running with Docker

The easiest way to run this service is with Docker:

```bash
# Build and run using docker-compose from the root directory:
docker-compose up --build video-compression-service

# Or build and run just this service:
cd backend/Video-Compression-Service
docker build -t video-compression-service .
docker run -p 8080:8080 video-compression-service
```

## Manual Setup

If you prefer to run without Docker:

### Requirements

- Go 1.18 or higher
- FFmpeg installed on the system

### Build and Run

1. Make sure FFmpeg is installed on your system
2. Navigate to the service directory:
   ```
   cd backend/Video-Compression-Service
   ```
3. Build the service:
   ```
   go build -buildvcs=false -o video-compression-service .
   ```
4. Run the service:
   ```
   ./video-compression-service
   ```

The service will start on port 8080 by default.

## API Endpoints

### 1. Compress Video

**Endpoint:** `POST /compress`

**Form Parameters:**

- `video` (required): The video file to compress
- `quality` (optional): Compression quality (0-51, lower is better quality)
  - Default: 23 (standard quality)
  - 0: Lossless (largest files)
  - 18-23: Visually lossless to most viewers
  - 28: Medium-low quality
  - 51: Lowest quality (smallest files)

**Response:**

The compressed video is returned directly in the response body with appropriate headers:

- `Content-Type`: Matching the video format (e.g., video/mp4)
- `Content-Disposition`: attachment; filename=compressed_example.mp4

### 2. Health Check

**Endpoint:** `GET /health`

**Response:**

```json
{
  "ok": true
}
```

## API Gateway Integration

This service is configured to work with the API Gateway at the `/video-compression` endpoint.

When running with Docker, the API Gateway routes requests to this service using the Docker network: `http://video-compression-service:8080`.

When running standalone, update the API Gateway routes to point to `http://localhost:8080`.
