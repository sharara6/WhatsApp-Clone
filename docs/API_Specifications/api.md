# API Specifications

Beware that this is **NOT** all of the APIs used as this is not final it is just a starting guide.

---

## Authentication Endpoints

### POST `/auth/login`

- **Method:** POST
- **Description:** Authenticates a user and returns a JWT token.
- **Request Parameters:**
  - **Body (application/json):**
    - `email` (string, required): User's email address.
    - `password` (string, required): User's password.
- **Responses:**
  - **200 OK:**
    - **Body (application/json):**
      - `token` (string): JWT token for authenticated requests.
      - `userId` (string): The authenticated user's unique identifier.
  - **401 Unauthorized:**
    - **Body (application/json):**
      - `error` (string): Message indicating invalid credentials.

### POST `/auth/register`

- **Method:** POST
- **Description:** Registers a new user into the system.
- **Request Parameters:**
  - **Body (application/json):**
    - `name` (string, required): User's full name.
    - `email` (string, required): User's email address.
    - `password` (string, required): User's password.
- **Responses:**
  - **201 Created:**
    - **Body (application/json):**
      - `userId` (string): Unique identifier for the newly registered user.
      - `message` (string): Confirmation message.
  - **400 Bad Request:**
    - **Body (application/json):**
      - `error` (string): Message indicating why registration failed.

---

## User Management Endpoints

### GET `/users/{userId}`

- **Method:** GET
- **Description:** Retrieves profile information for a specific user.
- **Request Parameters:**
  - **Path Parameter:**
    - `userId` (string, required): Unique identifier of the user.
- **Responses:**
  - **200 OK:**
    - **Body (application/json):**
      - `userId` (string)
      - `name` (string)
      - `email` (string)
      - `profilePictureUrl` (string, optional)
  - **404 Not Found:**
    - **Body (application/json):**
      - `error` (string): Message indicating the user was not found.

### PUT `/users/{userId}`

- **Method:** PUT
- **Description:** Updates profile information for a specific user.
- **Request Parameters:**
  - **Path Parameter:**
    - `userId` (string, required): Unique identifier of the user.
  - **Body (application/json):**
    - `name` (string, optional): Updated user name.
    - `profilePictureUrl` (string, optional): Updated profile picture URL.
- **Responses:**
  - **200 OK:**
    - **Body (application/json):**
      - `message` (string): Success confirmation.
  - **400 Bad Request:**
    - **Body (application/json):**
      - `error` (string): Error message indicating the issue.
  - **404 Not Found:**
    - **Body (application/json):**
      - `error` (string): Message indicating that the user was not found.

---

## Conversation and Messaging Endpoints

### GET `/conversations`

- **Method:** GET
- **Description:** Retrieves a list of conversations for the authenticated user.
- **Request Parameters:**
  - **Query Parameters:**
    - `limit` (integer, optional): Maximum number of conversations to return.
    - `offset` (integer, optional): Number of conversations to skip.
- **Responses:**
  - **200 OK:**
    - **Body (application/json):**
      - `conversations` (array): List of conversation summaries. Each summary includes:
        - `conversationId` (string)
        - `participants` (array of strings)
        - `lastMessage` (string)
        - `timestamp` (string)

### GET `/conversations/{conversationId}/messages`

- **Method:** GET
- **Description:** Retrieves messages for a specific conversation.
- **Request Parameters:**
  - **Path Parameter:**
    - `conversationId` (string, required): Unique identifier of the conversation.
  - **Query Parameters:**
    - `limit` (integer, optional): Maximum number of messages to return.
    - `offset` (integer, optional): Number of messages to skip.
- **Responses:**
  - **200 OK:**
    - **Body (application/json):**
      - `messages` (array): List of messages. Each message includes:
        - `messageId` (string)
        - `senderId` (string)
        - `content` (string)
        - `timestamp` (string)
  - **404 Not Found:**
    - **Body (application/json):**
      - `error` (string): Message indicating the conversation was not found.

### POST `/conversations/{conversationId}/messages`

- **Method:** POST
- **Description:** Sends a new message in a specific conversation.
- **Request Parameters:**
  - **Path Parameter:**
    - `conversationId` (string, required): Unique identifier of the conversation.
  - **Body (application/json):**
    - `senderId` (string, required): Unique identifier of the sender.
    - `content` (string, required): The message content.
- **Responses:**
  - **201 Created:**
    - **Body (application/json):**
      - `messageId` (string): Unique identifier for the created message.
      - `timestamp` (string): Time when the message was sent.
  - **400 Bad Request:**
    - **Body (application/json):**
      - `error` (string): Error message indicating what went wrong.

---

## Asynchronous Communication via WebSockets

### WebSocket Endpoint `/ws`

- **Endpoint:** `/ws`
- **Description:**  
  A WebSocket endpoint to handle real-time messaging and notifications.
- **Connection:**  
  Clients connect to `/ws` to establish a persistent, bidirectional communication channel.
- **Message Format:**  
  JSON objects with the following structure:
  ```json
  {
    "type": "NEW_MESSAGE",
    "payload": {
      "conversationId": "string",
      "messageId": "string",
      "senderId": "string",
      "content": "string",
      "timestamp": "ISO8601 string"
    }
  }
  ```
