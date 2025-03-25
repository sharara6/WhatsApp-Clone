# WhatsApp Clone

A full-featured WhatsApp clone that allows users to sign up and log in using email and password authentication. This project implements real-time messaging, user authentication, and a responsive UI.

## Features

- **Email & Password Authentication**: Secure authentication with NextAuth.js and PostgreSQL.
- **Real-Time Messaging**: Instant communication using WebSockets.
- **Media Sharing**: Send images, videos, and documents.
- **Group Chats**: Create and manage group conversations.
- **User Profiles**: Update profile pictures and display names.
- **Online Status & Typing Indicators**: Show when users are online or typing.
- **Notifications**: Push and in-app notifications for new messages.

## Tech Stack

- **Frontend**: React.js (with Tailwind CSS)
- **Backend**: Node.js with Express / Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM (structured data)
- **Cache**: Redis for caching
- **Messaging Storage**: MongoDB for unstructured data (messages)
- **Authentication**: NextAuth.js (JWT & OAuth support)
- **Real-time Communication**: WebSockets
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
- Add contacts and start chatting in real-time.
- Send messages, images, and other media.
- Create group chats and manage participants.
- Receive notifications for new messages.

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

