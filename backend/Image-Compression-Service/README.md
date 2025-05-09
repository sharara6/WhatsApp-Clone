# Image Compression Service

This service provides image compression functionality for the WhatsApp Clone application.

## Features

- Image compression using Sharp
- Test mode with heavy compression for visible results:
  - Resizes images to 400px width
  - Applies 20% quality JPEG compression
  - Reduces color information with chroma subsampling (4:2:0)
  - Forces JPEG output for consistent results

## API Endpoints

### POST /compress

Compresses an uploaded image.

**Request:**

- Form data with a `file` field containing the image to compress

**Response:**

- The compressed image binary data (in JPEG format)
- Content-Type: image/jpeg

## Integration with Message Service

The Image Compression Service is designed to work with the Message Service. When a user sends an image in a chat:

1. The Message Service sends the original image to this service
2. This service compresses the image heavily (for testing purposes)
3. The compressed image is returned to the Message Service
4. The Message Service stores the compressed image

## Environment Variables

Add these environment variables to your `.env` file:

```
# Server configuration
PORT=8081
```

## Running the Service

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```
