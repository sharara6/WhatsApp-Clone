# WhatsApp Clone

A full-featured one-to-one messaging app that allows users to sign up and log in using email and password authentication, without requiring a SIM card. This project implements real-time messaging, user authentication, and a responsive UI.

## Features

- **Email & Password Authentication**: Secure authentication with JWT and OAuth 2.0.
- **One-to-One Messaging**: Direct communication between users.
- **Real-Time Messaging**: Instant communication using WebSockets and MQTT.
- **User Profiles**: Update profile pictures and display names.
- **Friend Requests**: Send and accept friend requests before initiating chats.
- **Online Status**: Show when users are online.
- **Notifications**: Push and in-app notifications for new messages.

## Tech Stack

- **Frontend**: React (Next.js) with Tailwind CSS
- **Backend**: Go (Golang) for microservices, Node.js for WebSockets and API gateway
- **Database**:
  - PostgreSQL for relational data (users, authentication)
  - Redis for caching and real-time session management
  - MongoDB for unstructured chat messages
- **Authentication**: JWT and OAuth 2.0 (Google, Facebook logins)
- **Real-time Communication**: WebSockets & MQTT for messaging
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
     MQTT_BROKER=mqtt://host:port
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
3. Configure Azure PostgreSQL, Redis, MongoDB, and MQTT.
4. Set up environment variables in Azure.

## License

This project is licensed under the MIT License.

## Contact

For any issues, open an issue or contact [nour.awad094@gmail.com].

