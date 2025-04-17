# Use Case ID #UC-5

## Use Case Name: Display Contact Online/Offline Status

### Description

- Displays the real-time online/offline status of contacts.

### Actors

- Primary Actor: User
- Secondary Actor: Presence System

### Preconditions

- User must be logged in.
- Contact must be in the user's contact list.

### Main Flow

1. System checks the online status of contacts.
2. Online contacts are marked as "Online."
3. Offline contacts are marked as "Offline."

### Alternative Flow

1. If the system cannot fetch the status, it shows the last known status.

### Postconditions

- User sees the correct real-time status of their contacts.