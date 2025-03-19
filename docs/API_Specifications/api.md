# Resilience Strategies

## Implemented Resilience Mechanisms

### Circuit Breakers

- **Explanation:**  
  Circuit breakers monitor service interactions and “trip” when failures exceed a set threshold. When a service becomes unresponsive or experiences errors, the circuit breaker prevents further calls until the service stabilizes, thereby stopping cascading failures across microservices.

- **Justification:**  
  This mechanism is vital for isolating faults in a distributed microservices architecture. By failing fast, the system avoids overloading the failing service and provides an opportunity for recovery without impacting overall system performance.

### Retries with Exponential Backoff

- **Explanation:**  
  In the event of transient errors (e.g., network hiccups or momentary service unavailability), the system automatically retries the failed operation. An exponential backoff strategy is used, where the time interval between retries increases progressively to avoid overwhelming the service.

- **Justification:**  
  This approach is effective for handling temporary issues that can be resolved quickly without manual intervention. It ensures that transient failures do not escalate into broader service disruptions, thereby enhancing system reliability.

### Fallback Mechanisms

- **Explanation:**  
  When retries are exhausted and a service remains unavailable, fallback strategies come into play. These may include returning a cached response, a default value, or a user-friendly error message, ensuring that the system continues to function in a degraded but acceptable state.

- **Justification:**  
  Fallbacks provide graceful degradation, allowing critical operations to continue even when some components are down. This helps maintain a positive user experience by avoiding complete service outages and ensures that the system meets its high availability requirements.
