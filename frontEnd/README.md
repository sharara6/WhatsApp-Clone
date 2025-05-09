# WhatsApp Clone - Frontend

A modern WhatsApp web clone built with React and Vite, offering real-time messaging capabilities and a familiar user interface.

## Features

- Real-time messaging using Socket.IO
- User authentication
- Contact list management
- Chat rooms and private messaging
- Message status tracking (sent, delivered, read)
- User presence detection (online/offline status)
- Typing indicators
- Profile management
- Responsive design
- Media sharing capabilities

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS for styling
- Socket.IO for real-time communication
- React Router for navigation
- Redux/Context API for state management

## Architecture

### Messaging System

The application uses a hybrid messaging system:

- **Socket.IO** for reliable message delivery and status updates

#### Socket.IO Topics

- `whatsapp/messages` - Main chat messages
- `whatsapp/users/status` - User online/offline status
- `whatsapp/users/typing` - Typing indicators

#### Message Quality of Service (QoS)

- QoS 1 for chat messages and status updates
- QoS 0 for typing indicators and ephemeral data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Karim-Ashraf1/WhatsApp-Clone.git
cd WhatsApp-Clone/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables:

```env
VITE_API_URL=your_backend_url
VITE_SOCKET_URL=your_socket_url
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Project Structure

```
frontEnd/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and socket services
│   │   ├── socket/     # Socket.IO integration
│   │   └── api/        # REST API services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── assets/         # Static assets
│   ├── styles/         # Global styles
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Public assets
└── index.html          # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Message Flow

1. **Sending Messages**

   - Messages are sent via Socket.IO
   - Message delivery is confirmed by the server
   - Message status updates are tracked

2. **Receiving Messages**

   - Listen for events on Socket.IO connection
   - Handle different message types
   - Update UI in real-time

3. **Status Updates**
   - Online/offline presence
   - Message delivery confirmations
   - Read receipts
   - Typing indicators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/FeatureX`)
3. Commit your changes (`git commit -m 'Add some FeatureX'`)
4. Push to the branch (`git push origin feature/FeatureX`)
5. Open a Pull Request

## Troubleshooting

### Connection Issues

- Verify WebSocket server is running
- Check server URL and port
- Ensure network connectivity is working

### Message Delivery Problems

- Check Socket.IO connection status
- Verify event names match between client and server
- Monitor server logs for errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.
