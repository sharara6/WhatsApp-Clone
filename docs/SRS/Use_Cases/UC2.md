# Use Case ID #UC-2

## Use Case Name: Send and Receive Messages

### Description

- Allows users to send and receive text messages in real-time for one-on-one chats.

### Actors

- Primary Actor: User
- Secondary Actor: Messaging System

### Preconditions

- User must be logged into the system.
- User must have an active internet connection.

### Main Flow

1. User selects a contact.
2. User enters a message and sends it.
3. Messaging System processes and delivers the message.
4. Recipient receives the message in real-time.

### Alternative Flow

1. User sends a message, but the recipient is offline.
2. System stores the message and delivers it when the recipient is online.

### Postconditions

- Message is delivered successfully or stored for later delivery if the recipient is offline.