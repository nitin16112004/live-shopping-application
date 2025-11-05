# 🛍️ Live Shopping Platform

A production-ready real-time live shopping platform where sellers can host live video sessions and buyers can shop products in real-time with interactive features like chat, queues, and instant checkout.

## ✨ Features

### Core Features
- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control (User, Seller, Admin)
- 📹 **Live Video Streaming** - WebRTC-based video streaming (infrastructure ready, full implementation TODO)
- 💬 **Real-time Chat** - Interactive chat during live sessions using Socket.IO
- 🛒 **Shopping Cart** - Add products to cart during live sessions
- 💳 **Stripe Checkout** - Secure payment processing with Stripe
- 📦 **Order Management** - Track order status and history
- 👥 **Real-time Queue System** - Manage waiting queues for popular sessions
- 🎯 **Product Spotlight** - Sellers can highlight specific products during streams
- 📊 **Viewer Count** - Real-time viewer statistics
- 🔄 **Session Status** - Track scheduled, live, and ended sessions

### Technical Features
- ⚡ Real-time bidirectional communication with Socket.IO
- 🗄️ MongoDB for data persistence
- 🚀 Redis for caching and session management
- 🐳 Docker Compose for easy deployment
- 🎨 Modern responsive UI with Tailwind CSS
- 🔒 Secure password hashing with bcrypt
- ✅ Input validation and error handling

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client
- Axios
- React Router

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Redis
- Socket.IO
- JWT Authentication
- Stripe API
- Simple Peer (WebRTC)

**Infrastructure:**
- Docker & Docker Compose
- MongoDB Container
- Redis Container

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)
- Stripe account (for payment processing)

### Running with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/nitin16112004/live-shopping-application.git
   cd live-shopping-application
   ```

2. **Set up environment variables**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your Stripe keys
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Seed the database** (in a new terminal)
   ```bash
   docker-compose exec backend npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Running Locally (Without Docker)

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up MongoDB and Redis**
   - Install MongoDB locally or use MongoDB Atlas
   - Install Redis locally

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URLs and Stripe keys
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the backend**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend**
   ```bash
   npm run dev
   ```

## 📖 Usage

### Test Accounts

After seeding the database, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Seller 1 | seller1@example.com | password123 |
| Seller 2 | seller2@example.com | password123 |
| User 1 | user1@example.com | password123 |
| User 2 | user2@example.com | password123 |

### User Workflows

#### As a Buyer:
1. Register or login with a user account
2. Browse live shopping rooms on the home page
3. Join a live room to watch video and chat
4. Add products to cart during the live session
5. Proceed to checkout with Stripe
6. View order history in the Orders page

#### As a Seller:
1. Register or login with a seller account
2. Create products from the dashboard
3. Create shopping rooms with scheduled times
4. Start live sessions when ready
5. Interact with buyers through chat
6. Spotlight products during the session
7. End the session when complete

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📁 Project Structure

```
live-shopping-application/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and Redis configuration
│   │   ├── models/         # Mongoose models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth and other middleware
│   │   ├── services/       # Business logic (Socket.IO)
│   │   ├── utils/          # Utilities (seed script)
│   │   └── server.js       # Entry point
│   ├── tests/              # Test files
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Zustand stores
│   │   ├── services/       # API and Socket services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── ARCHITECTURE.md     # Detailed architecture docs
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:admin123@localhost:27017/live_shopping?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Shopping Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room (Seller/Admin)
- `PUT /api/rooms/:id` - Update room (Seller/Admin)
- `DELETE /api/rooms/:id` - Delete room (Seller/Admin)
- `POST /api/rooms/:id/start` - Start live session (Seller/Admin)
- `POST /api/rooms/:id/end` - End live session (Seller/Admin)

### Orders
- `POST /api/orders/checkout` - Create Stripe checkout session
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### WebSocket Events

**Client to Server:**
- `join-room` - Join a shopping room
- `leave-room` - Leave a shopping room
- `chat-message` - Send chat message
- `webrtc-offer` - Send WebRTC offer
- `webrtc-answer` - Send WebRTC answer
- `webrtc-ice-candidate` - Send ICE candidate
- `spotlight-product` - Highlight product (Seller)
- `join-queue` - Join waiting queue

**Server to Client:**
- `joined-room` - Confirmation of room join
- `viewer-count` - Updated viewer count
- `chat-message` - Broadcast chat message
- `webrtc-offer` - Receive WebRTC offer
- `webrtc-answer` - Receive WebRTC answer
- `webrtc-ice-candidate` - Receive ICE candidate
- `product-spotlight` - Product highlighted
- `queue-joined` - Queue position
- `room-full` - Room capacity reached
- `error` - Error message

## 🚧 TODO: WebRTC Implementation

The current implementation includes WebRTC signaling infrastructure but uses a placeholder for the actual video stream. To implement full WebRTC video streaming:

### Required Steps:

1. **Media Server Setup**
   - Integrate a media server (e.g., mediasoup, Janus, or Kurento)
   - Configure STUN/TURN servers for NAT traversal

2. **Seller Video Capture**
   - Implement getUserMedia() for camera/screen capture
   - Create peer connection and add tracks
   - Send offer to server via Socket.IO

3. **Viewer Video Reception**
   - Receive offer from server
   - Create peer connection
   - Handle ICE candidates
   - Display remote stream in video element

4. **Reconnection Logic**
   - Handle connection drops
   - Implement exponential backoff
   - Show connection status to users

5. **Optimization**
   - Implement bandwidth adaptation
   - Add quality selection
   - Handle multiple viewers efficiently

### Placeholder Location
The WebRTC placeholder can be found in:
- Frontend: `frontend/src/pages/RoomView.jsx` (line ~80)
- Backend: WebRTC signaling in `backend/src/services/socketService.js` (lines ~135-164)

## 📚 Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - Detailed system architecture and design decisions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Stripe for payment processing
- MongoDB for database
- Redis for caching
- React and Vite for frontend
- Tailwind CSS for styling

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note:** This is a development/demo application. Before deploying to production:
- Change all default passwords and secrets
- Add rate limiting
- Implement proper error logging
- Add monitoring and alerting
- Configure proper CORS settings
- Set up SSL/TLS certificates
- Review and enhance security measures
- Implement proper WebRTC video streaming