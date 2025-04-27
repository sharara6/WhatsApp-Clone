# WhatsApp Clone - Frontend

A modern WhatsApp web clone built with React and Vite, offering real-time messaging capabilities and a familiar user interface.

## Features

- Real-time messaging using MQTT and Socket.IO
- Message delivery status tracking (sent, delivered, read)
- User presence detection (online/offline status)
- Typing indicators
- Contact list management
- Chat rooms and private messaging
- Profile management
- Responsive design
- Media sharing capabilities

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS for styling
- MQTT.js for real-time messaging
- Socket.IO for additional real-time features
- React Router for navigation
- Redux/Context API for state management

## Architecture

### Messaging System

The application uses a hybrid messaging system:

- **MQTT** for reliable message delivery and status updates
- **Socket.IO** for complementary real-time features

#### MQTT Topics

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
- MQTT Broker (e.g., Mosquitto)

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
VITE_MQTT_BROKER_URL=your_mqtt_broker_url
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
│   ├── services/       # API and messaging services
│   │   ├── mqtt/       # MQTT client and handlers
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

   - Messages are published to MQTT broker
   - QoS 1 ensures at-least-once delivery
   - Message status updates are tracked

2. **Receiving Messages**

   - Subscribe to relevant MQTT topics
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

### MQTT Connection Issues

- Verify MQTT broker is running
- Check broker URL and port
- Ensure credentials are correct
- Check network connectivity

### Message Delivery Problems

- Verify QoS levels
- Check topic subscriptions
- Monitor broker logs
- Verify message format

## License

This project is licensed under the MIT License - see the LICENSE file for details.
