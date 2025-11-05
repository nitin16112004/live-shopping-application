# Live Shopping Platform - Architecture Documentation

## Overview

The Live Shopping Platform is a real-time e-commerce application that enables sellers to host live shopping sessions where buyers can watch live video streams, interact via chat, and purchase products in real-time.

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Simple Peer** - WebRTC wrapper (for video streaming)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching and session management
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### Infrastructure
- **Docker Compose** - Container orchestration
- **MongoDB Container** - Database
- **Redis Container** - Cache and session store
- **Backend Container** - API server
- **Frontend Container** - React application

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │   Store    │            │
│  │            │  │            │  │  (Zustand) │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │              │                │                    │
│         └──────────────┴────────────────┘                    │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
    ┌───────▼────────┐      ┌────────▼─────────┐
    │   HTTP/REST    │      │   WebSocket      │
    │   (Axios)      │      │  (Socket.IO)     │
    └───────┬────────┘      └────────┬─────────┘
            │                         │
┌───────────┴─────────────────────────┴───────────────────────┐
│                   Backend (Express + Socket.IO)             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Routes   │  │Controllers │  │   Models   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ Middleware │  │  Services  │  │   Socket   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└───────────┬─────────────────────────┬───────────────────────┘
            │                         │
    ┌───────▼────────┐      ┌────────▼─────────┐
    │    MongoDB     │      │      Redis       │
    │   (Database)   │      │  (Cache/Queue)   │
    └────────────────┘      └──────────────────┘
```

## System Components

### 1. Frontend Application

#### Pages
- **Home** - Landing page with live rooms showcase
- **Login/Register** - Authentication pages
- **Products** - Product listing with filters
- **Rooms** - Shopping room listing
- **RoomView** - Live shopping room with video, chat, and products
- **Cart** - Shopping cart management
- **Orders** - Order history

#### State Management
- **authStore** - User authentication state
- **cartStore** - Shopping cart state
- **Socket Service** - WebSocket connection management

### 2. Backend Application

#### Models
- **User** - User accounts (buyers, sellers, admins)
- **Product** - Product catalog
- **ShoppingRoom** - Live shopping sessions
- **Order** - Purchase orders

#### Controllers
- **authController** - Authentication and user management
- **productController** - Product CRUD operations
- **roomController** - Shopping room management
- **orderController** - Order processing and Stripe integration

#### Services
- **socketService** - Real-time event handling
  - Room join/leave
  - Chat messages
  - WebRTC signaling
  - Viewer count management
  - Queue management

### 3. Real-Time Features

#### WebSocket Events
- `join-room` - User joins a shopping room
- `leave-room` - User leaves a shopping room
- `chat-message` - Send/receive chat messages
- `viewer-count` - Update viewer count
- `webrtc-offer` - WebRTC offer for video streaming
- `webrtc-answer` - WebRTC answer for video streaming
- `webrtc-ice-candidate` - ICE candidate exchange
- `spotlight-product` - Highlight specific product
- `join-queue` - Join waiting queue

#### Redis Usage
- **Room Viewers** - Track active viewers per room (Sets)
- **Chat History** - Store recent chat messages (Lists)
- **Queue Management** - Manage user queues (Lists)
- **Session Storage** - User session data

### 4. Authentication Flow

```
1. User registers/logs in
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in HTTP headers for API calls
6. Token used for Socket.IO authentication
```

### 5. Checkout Flow

```
1. User adds products to cart
2. User initiates checkout
3. Backend creates Stripe checkout session
4. User redirected to Stripe
5. Payment processed by Stripe
6. User redirected back to app
7. Order created in database
8. Product stock updated
```

### 6. Live Shopping Flow

```
1. Seller creates shopping room with products
2. Seller starts live stream
3. Room status changes to "live"
4. Buyers join room via Socket.IO
5. WebRTC connection established for video
6. Buyers can:
   - Watch live video
   - Send chat messages
   - Add products to cart
   - Join queue for special access
7. Real-time viewer count updated
8. Seller ends stream
9. Room status changes to "ended"
```

## WebRTC Implementation (TODO)

The current implementation includes WebRTC signaling infrastructure but uses placeholder video. To implement full WebRTC:

### Server Side
1. Implement media server (e.g., mediasoup or Janus)
2. Handle stream ingestion from seller
3. Distribute stream to multiple viewers
4. Handle bandwidth adaptation

### Client Side
1. Capture seller's video/audio stream
2. Establish peer connections
3. Handle ICE candidates
4. Display remote streams
5. Implement reconnection logic

## Security Considerations

1. **Authentication** - JWT tokens with expiration
2. **Authorization** - Role-based access control (user, seller, admin)
3. **Input Validation** - Express-validator for request validation
4. **Password Security** - bcryptjs hashing
5. **CORS** - Configured for specific origins
6. **Rate Limiting** - Should be added for production
7. **SQL Injection Prevention** - Mongoose parameterized queries
8. **XSS Prevention** - React's built-in escaping

## Scalability Considerations

1. **Horizontal Scaling** - Multiple backend instances with load balancer
2. **Redis Clustering** - For distributed cache and sessions
3. **MongoDB Sharding** - For large datasets
4. **CDN** - For static assets and video streaming
5. **Message Queue** - For asynchronous processing (e.g., order emails)
6. **Microservices** - Split into smaller services as needed

## Monitoring and Logging

Recommended additions:
1. Application logging (Winston, Bunyan)
2. Error tracking (Sentry)
3. Performance monitoring (New Relic, DataDog)
4. Database monitoring
5. WebSocket connection metrics

## Future Enhancements

1. **Video Recording** - Record and replay past sessions
2. **Analytics Dashboard** - Seller and admin analytics
3. **Mobile Apps** - Native iOS/Android applications
4. **Push Notifications** - Room start notifications
5. **Social Features** - Follow sellers, share rooms
6. **AI Recommendations** - Product recommendations
7. **Multi-language Support** - Internationalization
8. **Advanced Search** - Elasticsearch integration
