# WhatsApp Clone Microservices

A WhatsApp clone built with microservices architecture using Node.js, React, and MongoDB.

## Services

- **API Gateway**: Manages API routing and authentication (Port 5000)
- **User Service**: Handles user management and authentication (Port 5001)
- **Message Service**: Manages messaging and real-time communication (Port 5002)
- **Video Compression Service**: Processes and compresses video files (Port 8080)
- **Broker Service**: Handles message queuing with RabbitMQ
- **Frontend**: React application with Vite (Port 5173)

## Docker Setup

### Prerequisites

- Docker
- Docker Compose

### Setup Instructions

1. Clone the repository:

   ```
   git clone <repository-url>
   cd WhatsApp-Clone
   ```

2. Create environment files:

   ```
   cp docker-env-example .env
   ```

3. Update the `.env` file with your own configuration values.

4. Build and start the containers:

   ```
   docker-compose up --build
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:5000
   - User Service: http://localhost:5001
   - Message Service: http://localhost:5002
   - Video Compression Service: http://localhost:8080

### Development without Docker

1. Create environment files for each service
2. Install dependencies in each service directory:
   ```
   cd <service-directory>
   npm install
   ```
3. Start each service according to their package.json scripts:
   ```
   npm run dev
   ```

## Services Information

### API Gateway

- Routes API requests to appropriate services
- Handles authentication and authorization

### User Service

- Manages user accounts, profiles, and authentication
- Connects to MongoDB for user data

### Message Service

- Handles message storage and retrieval
- Implements real-time messaging with Socket.IO
- Connects to MongoDB for message data

### Video Compression Service

- Processes video uploads
- Compresses videos for efficient storage and streaming

### Broker Service

- Handles message queuing with RabbitMQ

### Frontend

- React application with modern UI
- Communicates with backend services through API Gateway

## Features

- **Email & Password Authentication**: Secure authentication with JWT and OAuth 2.0.
- **One-to-One Messaging**: Direct communication between users.
- **Real-Time Messaging**: Instant communication using WebSockets.
- **User Profiles**: Update profile pictures and display names.
- **Friend Requests**: Send and accept friend requests before initiating chats.
- **Online Status**: Show when users are online.
- **Notifications**: Push and in-app notifications for new messages.
- **Video Compression**: Automatic compression of video files before sharing.

## Tech Stack

- **Frontend**: React (Next.js) with Tailwind CSS
- **Backend**: Go (Golang) for microservices, Node.js for WebSockets and API gateway
- **Microservices**:
  - **API Gateway**: Node.js service for routing and authentication
  - **Video Compression Service**: Go-based service for efficient video compression using FFmpeg
  - **Broker Service**: Go-based service for RabbitMQ message handling
- **Database**:
  - PostgreSQL for relational data (users, authentication)
  - Redis for caching and real-time session management
  - MongoDB for unstructured chat messages
- **Messaging**: RabbitMQ for reliable inter-service communication
- **Authentication**: JWT and OAuth 2.0 (Google, Facebook logins)
- **Real-time Communication**: WebSockets for messaging
- **Storage**: Cloudinary / AWS S3

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Karim-Ashraf1/WhatsApp-Clone.git
   cd WhatsApp-Clone
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Add database and authentication keys:
     ```env
     DATABASE_URL=postgresql://user:password@host:port/database
     REDIS_URL=redis://user:password@host:port
     MONGO_URI=mongodb://user:password@host:port/database
     NEXTAUTH_SECRET=your_secret
     NEXTAUTH_URL=http://localhost:3000
     ```

4. Run database migrations:

   ```sh
   npx prisma migrate dev
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

- Sign up or log in using your email and password.
- Send and accept friend requests to connect with others.
- Start chatting in real-time after becoming friends.

## Deployment

### Azure

1. Deploy frontend and backend services to Azure App Service.
2. Use Azure Monitor for application performance tracking.
3. Configure Azure PostgreSQL, Redis, and MongoDB.
4. Set up environment variables in Azure.

## License

This project is licensed under the MIT License.

## Contact

For any issues, open an issue or contact [nour.awad094@gmail.com].
