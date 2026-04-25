#  Activity Feed System (MERN Stack)

A tenant-isolated activity feed system built using **MongoDB, Express, React, and Node.js**, implementing cursor-based pagination, optimistic UI updates, and simulated real-time updates.

---

##  Features

### Backend

* Create activity (`POST /activities`)
* Fetch activity feed (`GET /activities`)
* Tenant isolation using `tenantId`
* Cursor-based pagination (no offset/skip)
* Compound indexing for performance
* Projection to limit payload size

### Frontend

* Infinite scrolling activity feed
* Optimistic UI updates for instant feedback
* Simulated real-time updates (polling)
* Loading and empty states
* Clean, responsive UI

---

##  Tech Stack

* **Frontend:** React (Hooks)
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Styling:** CSS

---

##  API Design

### 1. Create Activity

```http
POST /api/activities
```

#### Request Body

```json
{
  "actorId": "user_1",
  "actorName": "John Doe",
  "type": "created task",
  "metadata": {
    "title": "Fix login bug"
  }
}
```

---

### 2. Get Activities (Cursor Pagination)

```http
GET /api/activities?cursor=<ISO_DATE>&limit=10
```

#### Response

```json
{
  "data": [...],
  "nextCursor": "2026-04-25T10:04:00.000Z"
}
```

---

##  Cursor Pagination Explained

Instead of using offset-based pagination (`skip`), this system uses a **cursor-based approach**.

### How it works:

1. Fetch latest records sorted by `createdAt DESC`
2. Store last item's timestamp as `cursor`
3. Next request fetches:

```js
createdAt < cursor
```

### Why not `skip()`?


- MongoDB scans and skips N documents → O(N)
- Slow for large datasets
- Poor performance at scale

### Benefits of cursor:

*  Uses index efficiently
*  O(limit) query performance
*  Stable pagination

---

##  Performance Optimization

### Index Used

```js
{ tenantId: 1, createdAt: -1 }
```

### Why this index?

* Filters by `tenantId`
* Sorts by `createdAt`
* Matches query pattern exactly

---

##  Frontend Architecture

### Key Concepts:

* Custom hook (`useActivities`) for state management
* Separation of concerns (API, hooks, UI)
* Infinite scroll implementation
* Controlled re-renders using `useCallback`

---

##  Optimistic UI Update

### Flow:

1. User creates activity
2. UI updates immediately (optimistic)
3. API request sent in background
4. On success → replace temporary item
5. On failure → rollback

### Why?

* Improves perceived performance
* Better user experience

---

##  Real-Time Updates (Simulated)

Implemented using polling:

```js
setInterval(fetchActivities, 5000);
```

### Why polling?

* Simpler implementation

### Production alternative:

* WebSocket (bi-directional real-time communication)

---

##  System Design: Scaling to 50M Activities per Tenant

### 1. Indexing

* Compound index on `(tenantId, createdAt)`

---

### 2. Sharding Strategy

* Shard by `tenantId`
* Heavy tenants can be isolated into separate shards

---

### 3. Hot Tenant Isolation

* Detect high-traffic tenants
* Allocate dedicated resources/shards

---

### 4. Data Retention

* Use TTL index for auto-deletion

```js
{ createdAt: 1 }, expireAfterSeconds: 90 days
```

---

### 5. Real-Time Delivery

| Option    | Use Case                   |
| --------- | -------------------------- |
| WebSocket | Full-duplex real-time apps |
| SSE       | Server → client updates    |

 Preferred: **WebSocket**

---

##  Debugging & Refactoring

### Problem Code

```js
useEffect(() => {
  fetchActivities();
}, [activities]);
```

### Issue

* Infinite loop
* API called repeatedly

### Fix

```js
useEffect(() => {
  fetchActivities();
}, []);
```

### Prevention

* Understand dependency arrays
* Avoid state in dependencies unnecessarily

---

##  Bonus: Event-Driven Architecture

### Flow

1. API receives request
2. Push event to queue
3. Worker processes event
4. Store in DB

### Tools

* BullMQ
* Kafka
* RabbitMQ

### Benefits

* Decoupled system
* Improved scalability
* Retry & failure handling

---

##  Key Learnings

* Cursor pagination is essential for scalable feeds
* Optimistic UI improves UX significantly
* Index design directly impacts performance
* Separation of concerns improves maintainability

---

##  Conclusion

This project demonstrates:

* Backend performance optimization
* Clean React architecture
* Real-time system simulation
* Scalable system design thinking

---
