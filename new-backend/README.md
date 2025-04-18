# WhatsApp Clone Backend Microservices

This is a microservices-based backend for a WhatsApp Clone application with two separate services:

1. **User Service** - handles user authentication, profiles, and account management
2. **Message Service** - handles chat messaging features, communicating with the User Service through APIs

## Services Architecture

### User Service (PORT 5001)
- Authentication (signup, login, logout)
- User profile management
- User data storage
- Provides user validation API for Message Service

### Message Service (PORT 5002)
- Chat messaging functionality
- Real-time messaging with Socket.io
- No user database - relies entirely on User Service API
- Communicates with User Service for authentication and user data

## Communication Flow

1. Frontend authenticates with User Service and gets a JWT cookie
2. When accessing Message Service, it validates the JWT with User Service
3. Message Service fetches user data from User Service for chat operations
4. All user operations (profile updates, etc.) happen in User Service

## Setup Instructions

### Install dependencies
```bash
# From the root folder
cd new-backend
npm run install:all
```

### Environment Variables
Each service has its own `.env` file with the following variables:

#### User Service
```
MONGO_URI=mongodb+srv://...
PORT=5001
JWT_SECRET=YourSecretKey
NODE_ENV=development
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Message Service
```
MONGO_URI=mongodb+srv://...
PORT=5002
NODE_ENV=development
USER_SERVICE_URL=http://localhost:5001
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Services

### Development mode
```bash
# Run both services in development mode
npm run dev

# Or run services individually
npm run dev:user
npm run dev:message
```

### Production mode
```bash
# Run both services in production mode
npm start

# Or run services individually
npm run start:user
npm run start:message
```

## API Endpoints

### User Service (localhost:5001)

#### Authentication
- POST `/api/auth/signup` - Create a new user account
- POST `/api/auth/login` - Log in an existing user
- POST `/api/auth/logout` - Log out the current user
- GET `/api/auth/check` - Check current authentication status
- GET `/api/auth/validate` - Validate token (used by Message Service)

#### Users
- GET `/api/users` - Get all users (protected)
- GET `/api/users/:id` - Get user by ID (protected)
- POST `/api/auth/update-profile` - Update user profile (protected)

### Message Service (localhost:5002)

#### Messages
- GET `/api/messages/users` - Get users for sidebar chat list (protected)
- GET `/api/messages/:id` - Get chat messages with a user (protected)
- POST `/api/messages/send/:id` - Send message to a user (protected)
- GET `/api/messages/user/:userId` - Get user profile (proxied to user service)

## Communication Between Services

- Message Service communicates with User Service for authentication via API calls
- Message Service has no user database, only references user IDs
- Authentication is centralized in the User Service 