ADR-001: Architectural Style Selection
Date: 20-03-2025
Status: Accepted

Context
The system requires scalability, high availability, and modularity to support real-time messaging while maintaining ease of deployment and updates.

Decision
Adopt a microservices architecture to ensure independent service scalability and maintainability.

Justification
Each service can scale independently based on workload.

Failures are isolated to individual services.

Services can be built using different technologies suited to their needs.

Consequences
Pros

✅ Independent scaling of services

✅ Faster updates and deployments

✅ Improved system resilience

Cons

❌ Increased deployment and monitoring complexity

❌ Requires service discovery and orchestration

ADR-002: Programming Languages Selection
Date: 20-03-2025
Status: Accepted

Context
The system requires efficient real-time capabilities, strong performance, and developer-friendly tooling for building scalable backend services.

Decision
Go (Golang): For performance-intensive microservices

TypeScript (Node.js): For WebSocket communication, API gateway, and developer tools

Justification
Go provides excellent performance and concurrency with low resource usage.

TypeScript improves code safety, maintainability, and tooling in Node.js environments.

Consequences
Pros

✅ High-performance backend with Go

✅ Safe and scalable service development with TypeScript

✅ Ability to use the right tool/language for the job

Cons

❌ Increased complexity in hiring and onboarding across languages

❌ Slightly more complex testing and CI pipelines

ADR-003: Frameworks and Tools Selection
Date: 20-03-2025
Status: Accepted

Context
To support real-time communication, REST APIs, and service orchestration, the system must rely on reliable and lightweight frameworks.

Decision
Node.js runtime (with TypeScript) for WebSocket services and API gateway

Express.js for REST API services

ws library for WebSocket server implementation

Justification
Node.js is efficient for I/O-bound tasks and real-time communication

Express is a lightweight, flexible choice for building REST APIs

ws is performant and simple to integrate for WebSocket support

Consequences
Pros

✅ Efficient real-time capabilities

✅ Modular and scalable backend stack

✅ Strong TypeScript support

Cons

❌ Requires robust handling of WebSocket state

❌ Needs structured service communication and monitoring

ADR-004: API Communication Strategy
Date: 20-03-2025
Status: Under Review

Context
The system must support both real-time data transfer and standard client-server communication between services.

Decision
REST API for standard communication between services and clients

WebSockets for real-time chat and live status updates

Justification
REST is standardized, simple, and well-supported

WebSockets offer persistent bi-directional communication ideal for messaging

Consequences
Pros

✅ Clear separation of real-time and request-based communication

✅ REST APIs are easy to integrate and document

✅ WebSockets offer low-latency updates

Cons

❌ Increases protocol management complexity

❌ Requires load balancing and monitoring for persistent connections

ADR-005: Authentication Method
Date: 20-03-2025
Status: Accepted

Context
The system must ensure secure, scalable user authentication with support for third-party login integrations.

Decision
Use JWT (JSON Web Tokens) for stateless authentication

Integrate OAuth 2.0 for login with external providers (e.g., Google, Facebook)

Justification
JWT enables fast, stateless access control

OAuth 2.0 enhances user convenience and security via trusted identity providers

Consequences
Pros

✅ Stateless and scalable authentication

✅ Easy to use across mobile and backend services

✅ Supports social login

Cons

❌ Requires token lifecycle management

❌ Must handle token security carefully (e.g., expiration, storage)

ADR-006: Database Selection
Date: 19-03-2025
Status: Under Review

Context
The system must manage user authentication, real-time message storage, and session/state tracking.

Decision
PostgreSQL for relational data (users, auth, metadata)

MongoDB for chat messages and unstructured content

Redis for in-memory caching and session tracking

Justification
PostgreSQL is reliable and ACID-compliant

MongoDB provides flexible schema for chat and logs

Redis ensures low-latency reads for sessions and status

Consequences
Pros

✅ Optimized for a mix of structured and unstructured data

✅ Fast caching with Redis

✅ Flexible querying across databases

Cons

❌ Increased operational overhead

❌ Requires careful data synchronization and monitoring

ADR-007: Message Broker Selection
Date: 20-03-2025
Status: Under Review

Context
The system relies on real-time events and asynchronous communication between microservices.

Decision
Use Apache Kafka for event streaming, message queueing, and analytics.

Justification
Kafka is scalable, fault-tolerant, and ideal for high-throughput systems

Supports both asynchronous microservice events and system-wide analytics

Consequences
Pros

✅ High reliability and performance

✅ Built-in support for pub/sub and event logs

✅ Scales well with service demands

Cons

❌ Requires expertise in setup and monitoring

❌ Adds some complexity for small-scale deployments