# Use Case ID #UC-3

## Use Case Name: Display Message Status Indicators

### Description

- Displays message status indicators (sent, delivered, read) to the user.

### Actors

- Primary Actor: User
- Secondary Actor: Messaging System

### Preconditions

- User must be logged in.
- Messages must be sent through the system.

### Main Flow

1. User sends a message.
2. Messaging System updates the message status as "Sent."
3. When the message is delivered, the status updates to "Delivered."
4. When the recipient reads the message, the status updates to "Read."

### Alternative Flow

1. If the message fails to send due to network issues, the system notifies the user and allows retry.

### Postconditions

- The message status updates correctly based on delivery and read status.