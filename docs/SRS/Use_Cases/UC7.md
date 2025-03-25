# Use Case ID #UC-7

## Use Case Name: Receive Push Notifications for Messages

### Description

- Sends push notifications for new messages.

### Actors

- Primary Actor: User
- Secondary Actor: Notification System

### Preconditions

- User must have notifications enabled.
- User must be logged into the system.

### Main Flow

1. System detects a new message.
2. System sends a push notification to the recipient.
3. User receives and opens the notification.

### Alternative Flow

1. If notifications are disabled, the message is received without a push notification.

### Postconditions

- User is notified of new messages in real-time.