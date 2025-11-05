# Development Guide

This guide helps you set up the Live Shopping Platform for development.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or Docker)
- Redis installed and running (or Docker)
- Git

## Project Structure

```
live-shopping-application/
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── config/      # Database and Redis config
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth and other middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic (Socket.IO)
│   │   ├── utils/       # Utilities
│   │   └── server.js    # Entry point
│   └── tests/           # Test files
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # State management (Zustand)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API and Socket services
│   │   └── App.jsx      # Main app component
│   └── public/          # Static assets
├── docs/                # Documentation
└── docker-compose.yml   # Docker orchestration
```

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd live-shopping-application
   cp backend/.env.example backend/.env
   ```

2. **Start services:**
   ```bash
   docker compose up
   ```

3. **Seed database:**
   ```bash
   docker compose exec backend npm run seed
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Option 2: Local Development (Without Docker)

#### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local database URLs
   ```

3. **Start MongoDB:**
   ```bash
   # MacOS with Homebrew
   brew services start mongodb-community

   # Linux with systemd
   sudo systemctl start mongod

   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

4. **Start Redis:**
   ```bash
   # MacOS with Homebrew
   brew services start redis

   # Linux with systemd
   sudo systemctl start redis

   # Or use Docker
   docker run -d -p 6379:6379 --name redis redis:7-alpine
   ```

5. **Seed database:**
   ```bash
   npm run seed
   ```

6. **Start backend:**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Development Workflow

### Making Backend Changes

1. **Edit code** in `backend/src/`
2. **Nodemon auto-restarts** the server
3. **Test changes** with curl or Postman
4. **Add tests** in `backend/tests/`
5. **Run tests:** `npm test`

### Making Frontend Changes

1. **Edit code** in `frontend/src/`
2. **Vite hot-reloads** automatically
3. **View changes** in browser at http://localhost:3000
4. **Check console** for errors

### Database Changes

1. **Edit models** in `backend/src/models/`
2. **Update seed script** if needed in `backend/src/utils/seed.js`
3. **Re-seed database:** `npm run seed`

### Adding API Endpoints

1. **Create/update controller** in `backend/src/controllers/`
2. **Create/update route** in `backend/src/routes/`
3. **Register route** in `backend/src/server.js`
4. **Test endpoint** with curl or Postman
5. **Update frontend service** in `frontend/src/services/api.js`

### Adding Frontend Pages

1. **Create page component** in `frontend/src/pages/`
2. **Add route** in `frontend/src/App.jsx`
3. **Add navigation link** in `frontend/src/components/Navbar.jsx`
4. **Test navigation**

## Useful Commands

### Backend

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Seed database
npm run seed

# Check syntax
node -c src/server.js
```

### Frontend

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Stop all services
docker compose down

# Restart services
docker compose restart

# Rebuild containers
docker compose up --build

# Execute command in container
docker compose exec backend npm run seed
```

## Debugging

### Backend Debugging

**Using Node.js debugger:**

1. Update `package.json` scripts:
   ```json
   "debug": "node --inspect src/server.js"
   ```

2. Run:
   ```bash
   npm run debug
   ```

3. Attach Chrome DevTools or VS Code debugger

**Using VS Code:**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

### Frontend Debugging

1. **Browser DevTools** - F12 in Chrome/Firefox
2. **React DevTools** - Install browser extension
3. **Redux DevTools** - For state debugging (if using Redux)

### Socket.IO Debugging

Enable Socket.IO debug logs:

**Backend:**
```javascript
const io = new Server(server, {
  cors: { /* ... */ },
  debug: true
});
```

**Frontend:**
```javascript
const socket = io('http://localhost:5000', {
  auth: { token },
  debug: true
});
```

## Testing

### Manual Testing

1. **Register accounts** with different roles
2. **Create products** as seller
3. **Create shopping rooms** as seller
4. **Start live sessions**
5. **Join rooms** as buyer
6. **Test chat** functionality
7. **Add to cart** and checkout
8. **View orders**

### API Testing

See [API_TESTING.md](./API_TESTING.md) for detailed API testing guide.

### Automated Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Code Quality

### Linting

Add ESLint to your project:

**Backend:**
```bash
npm install --save-dev eslint
npx eslint --init
```

**Frontend:**
```bash
npm install --save-dev eslint eslint-plugin-react
```

### Formatting

Use Prettier for consistent formatting:

```bash
npm install --save-dev prettier
npx prettier --write "src/**/*.{js,jsx}"
```

## Common Issues

### Port Already in Use

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error

- Check MongoDB is running
- Verify connection string in `.env`
- Check MongoDB logs

### Redis Connection Error

- Check Redis is running: `redis-cli ping`
- Verify Redis URL in `.env`
- Check Redis logs

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Docker volumes
docker compose down -v
docker compose up --build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Ensure all tests pass
5. Submit a pull request

## Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
