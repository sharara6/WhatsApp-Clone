# Video Compression Service

A microservice for compressing video files using FFmpeg with configurable quality settings.

## Features

- HTTP API for video compression
- Configurable compression quality (CRF 0-51)
- Integration with API Gateway
- Health check endpoint
- Serves compressed files for download

## Requirements

- Go 1.16 or higher
- FFmpeg installed on the system

## Setup

1. Make sure FFmpeg is installed on your system
2. Build the service:
   ```
   go build -o video-compression-service
   ```
3. Run the service:
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

```json
{
  "success": true,
  "message": "Video compressed successfully",
  "compressedUrl": "/files/compressed_1234567890_example.mp4"
}
```

### 2. Health Check

**Endpoint:** `GET /health`

**Response:**

```json
{
  "ok": true
}
```

### 3. Download Compressed Video

**Endpoint:** `GET /files/{filename}`

Serves the compressed video files.

## API Gateway Integration

This service is configured to work with the API Gateway at the `/video-compression` endpoint. The API Gateway routes requests to this service running on localhost:8080.
