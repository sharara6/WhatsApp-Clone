# Architectural Decision Records (ADRs)

## ADR-001: Architectural Style Selection  
**Date:** 17-03-2025  
**Status:** Accepted  

### Context  
The system requires **scalability, high availability, and modularity** to support real-time messaging while maintaining ease of deployment and updates.  

### Decision  
Adopt a **microservices architecture** to ensure independent service scalability and maintainability.  

### Justification  
- **Scalability:** Each service can scale independently based on workload.  
- **Fault Isolation:** A failure in one service does not impact others.  
- **Technology Flexibility:** Services can use different languages and databases.  

### Consequences  
#### Pros  
- ✅ Independent scaling of services  
- ✅ Faster updates and feature deployment  
- ✅ Resilient system with fault tolerance  

#### Cons  
- ❌ Increased operational complexity  
- ❌ Requires orchestration and monitoring tools  

---

## ADR-002: Programming Languages Selection  
**Date:** 18-03-2025  
**Status:** Accepted  

### Context  
The system requires **high-performance backend services**, **real-time capabilities**, and a **dynamic frontend** for an optimal user experience.  

### Decision  
- **Go (Golang):** Backend microservices for efficiency and concurrency.  
- **Node.js (NestJS):** WebSockets for real-time chat and API gateway.  
- **React (Next.js):** Frontend for a modern, responsive UI.  

### Justification  
- **Go:** Fast execution, low memory footprint, and efficient concurrency.  
- **Node.js:** Excellent for handling WebSockets and asynchronous operations.  
- **React:** Component-based architecture, SEO benefits with Next.js.  

### Consequences  
#### Pros  
- ✅ High-performance backend with Go  
- ✅ Scalable real-time communication with Node.js  
- ✅ Rich user experience with React  

#### Cons  
- ❌ Requires developers familiar with multiple technologies  
- ❌ Complexity in maintaining different tech stacks  

---

## ADR-003: API Communication Strategy  
**Date:** 18-03-2025  
**Status:** Accepted  

### Context  
The system must facilitate **efficient inter-service communication** while ensuring **low latency** for real-time interactions.  

### Decision  
- **REST API** for client-to-server communication (frontend to backend).  
- **gRPC** for inter-service communication (microservices).  
- **WebSockets** for real-time message updates.  

### Justification  
- **REST API:** Simple, widely adopted, and compatible with frontend technologies.  
- **gRPC:** Faster communication with low overhead and strong typing.  
- **WebSockets:** Persistent connection for real-time updates.  

### Consequences  
#### Pros  
- ✅ Faster and efficient service communication with gRPC  
- ✅ Real-time updates using WebSockets  
- ✅ Compatibility with external clients via REST  

#### Cons  
- ❌ Added complexity in managing multiple communication protocols  
- ❌ Requires monitoring and load balancing  

---

## ADR-004: Authentication Method  
**Date:** 19-03-2025  
**Status:** Accepted  

### Context  
The system must provide **secure and scalable user authentication**, preventing unauthorized access while supporting multi-device login.  

### Decision  
Use **JWT (JSON Web Token)** for authentication and **OAuth 2.0** for third-party login options.  

### Justification  
- **JWT:** Stateless authentication, reducing database queries.  
- **OAuth 2.0:** Enables Google and Facebook logins for convenience.  
- **Multi-factor authentication (MFA):** Enhances security.  

### Consequences  
#### Pros  
- ✅ Secure, scalable authentication  
- ✅ Supports third-party logins  
- ✅ Easy to integrate with mobile and web clients  

#### Cons  
- ❌ Token expiration and refresh mechanisms required  
- ❌ Security risks if tokens are not handled correctly  

---

## ADR-005: Database Selection  
**Date:** 19-03-2025  
**Status:** Accepted  

### Context  
The system requires **high-speed message storage and retrieval**, **user authentication**, and **real-time status tracking**.  

### Decision  
- **PostgreSQL:** For relational data (users, contacts, authentication).  
- **Redis:** For caching and real-time session management.  
- **MongoDB:** For chat messages and unstructured data storage.  

### Justification  
- **PostgreSQL:** Ensures **ACID compliance** for user data.  
- **Redis:** Provides **fast caching**, reducing load on databases.  
- **MongoDB:** Flexible for chat history and messages.  

### Consequences  
#### Pros  
- ✅ Optimized read/write speeds  
- ✅ Scalable data management  
- ✅ Efficient structured and unstructured storage  

#### Cons  
- ❌ Managing multiple databases adds complexity  
- ❌ Requires data synchronization across databases  

---

## ADR-006: Message Broker Selection  
**Date:** 20-03-2025  
**Status:** Accepted  

### Context  
The system needs **real-time message delivery** and **event-driven architecture** for efficient microservices communication.  

### Decision  
Use **RabbitMQ** as the primary message broker, with **Kafka** for event streaming and analytics.  

### Justification  
- **RabbitMQ:** Best suited for **real-time messaging, guaranteed delivery**, and **priority queuing**.  
- **Kafka:** Handles **chat analytics**, **event logs**, and **large-scale message processing**.  

### Consequences  
#### Pros  
- ✅ Reliable, scalable messaging system  
- ✅ Supports both synchronous and asynchronous communication  
- ✅ Improves fault tolerance  

#### Cons  
- ❌ Requires monitoring and scaling configurations  
- ❌ Message persistence adds some latency  

---
