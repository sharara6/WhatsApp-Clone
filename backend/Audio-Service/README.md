# Audio Service

A microservice for handling audio messages in the WhatsApp Clone application. This service provides functionality for recording, storing, and playing audio messages.

## Features

- Record audio messages
- Store audio files
- Send audio messages between users
- Receive and play audio messages
- Real-time message polling
- MongoDB integration for message storage

## Prerequisites

- Python 3.9+
- MongoDB
- Docker and Docker Compose (for containerized deployment)
- PortAudio (for audio recording)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend/Audio-Service
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
pip install sounddevice scipy requests
```

## Running the Service

### Using Docker (Recommended)

1. Start the service using Docker Compose:

```bash
docker-compose up audio-service
```

### Running Locally

1. Make sure MongoDB is running
2. Start the Flask server:

```bash
python serve.py
```

## Testing the Service

### Sending Audio Messages

```bash
python audioRecorder.py send --sender "user1" --recipient "user2" --duration 5
```

Options:

- `--sender`: Your user ID
- `--recipient`: Recipient's user ID
- `--duration`: Recording duration in seconds (default: 5)
- `--out`: Output filename (default: msg.wav)

### Receiving Audio Messages

```bash
python audioRecorder.py recv --recipient "user2" --interval 5
```

Options:

- `--recipient`: Your user ID
- `--interval`: Polling interval in seconds (default: 5)

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /upload`: Upload an audio file
  - Required fields: file, sender, recipient
- `GET /messages`: Get messages for a recipient
  - Query parameter: recipient
- `GET /<filename>`: Get an audio file

## Environment Variables

- `PORT`: Service port (default: 5003)
- `MONGO_URI`: MongoDB connection string (default: mongodb://mongo:27017/)

## Docker Configuration

The service is configured to run in a Docker container with:

- Python 3.9 slim base image
- Required system dependencies
- Volume mounts for code and uploads
- Network configuration for MongoDB access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
