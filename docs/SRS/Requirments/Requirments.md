# Functional Requirements

1. Users can send and receive text messages in real-time for one-on-one chats.
2. Message status indicators (e.g., sent, delivered, read) are displayed.
3. Users can add, remove, and view contacts in their contact list.
4. Online/offline status of contacts is visible in real-time.
5. User search within the app.
6. Push notifications for new messages.
7. User Registration & Login using email.

# Non-Functional Requirements

## Performance

- System should handle 10,000 messages per second.
1. System should be able to handle 10,000 concurrent users.
2. Message delivery latency is kept below 200 milliseconds.
3. The architecture ensures no single point of failure.
4. System should be scalable so it can handle a 50% increase in the number of users annually.

## Security

- OAuth2 authentication & authorization.
- Secure API implementation (rate limiting, HTTPS, JWT tokens).

## Availability & Reliability

- System should be available 99% of the time without fails.
- Quick recovery mechanisms (e.g., failover, retries) minimize downtime.

## Usability

### 3.1 Learnability

- System should be easy for new users to learn and use.
- Fault tolerance and feedback.

### 3.2 Efficiency

- System should enable users to perform their tasks in 3 or fewer steps.