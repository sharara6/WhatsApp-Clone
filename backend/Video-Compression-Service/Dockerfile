FROM golang:1.18-alpine AS builder

# Install required dependencies including FFmpeg
RUN apk add --no-cache ffmpeg gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go.mod
COPY go.mod ./

# Copy the source code
COPY *.go ./

# Build the application
RUN go build -o video-compression-service .

# Use a smaller alpine image for the final image
FROM alpine:3.16

# Install FFmpeg in the runtime container
RUN apk add --no-cache ffmpeg ca-certificates

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/video-compression-service .

# Create directories for temporary files
RUN mkdir -p /app/temp

# Expose the port the service runs on
EXPOSE 8080

# Command to run the executable
CMD ["./video-compression-service"] 