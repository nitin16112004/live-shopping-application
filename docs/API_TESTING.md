# API Testing Guide

This document provides examples for testing the Live Shopping Platform API using curl.

## Prerequisites

- Application running (via Docker Compose or locally)
- Backend API at http://localhost:5000

## Authentication

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

Response:
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@example.com",
    "password": "password123"
  }'
```

Save the returned token for authenticated requests.

### Get current user

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Products

### Get all products

```bash
curl -X GET http://localhost:5000/api/products
```

With filters:
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&minPrice=50&maxPrice=500"
```

### Get single product

```bash
curl -X GET http://localhost:5000/api/products/PRODUCT_ID
```

### Create product (Seller/Admin only)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics",
    "images": ["https://via.placeholder.com/300"]
  }'
```

### Update product (Seller/Admin only)

```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -d '{
    "price": 89.99,
    "stock": 45
  }'
```

### Delete product (Seller/Admin only)

```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

## Shopping Rooms

### Get all rooms

```bash
curl -X GET http://localhost:5000/api/rooms
```

Filter by status:
```bash
curl -X GET "http://localhost:5000/api/rooms?status=live"
```

### Get single room

```bash
curl -X GET http://localhost:5000/api/rooms/ROOM_ID
```

### Create room (Seller/Admin only)

```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -d '{
    "title": "Flash Sale Event",
    "description": "Amazing deals on electronics",
    "products": ["PRODUCT_ID_1", "PRODUCT_ID_2"],
    "scheduledTime": "2024-12-25T18:00:00.000Z",
    "maxViewers": 200
  }'
```

### Start live session (Seller/Admin only)

```bash
curl -X POST http://localhost:5000/api/rooms/ROOM_ID/start \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

### End live session (Seller/Admin only)

```bash
curl -X POST http://localhost:5000/api/rooms/ROOM_ID/end \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

## Orders

### Create checkout session

```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2
      }
    ]
  }'
```

Response includes Stripe checkout URL.

### Get user orders

```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get single order

```bash
curl -X GET http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Workflow Example

1. **Login as seller:**
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller1@example.com","password":"password123"}' \
  | jq -r '.token')
```

2. **Get products:**
```bash
curl -X GET http://localhost:5000/api/products | jq
```

3. **Get live rooms:**
```bash
curl -X GET "http://localhost:5000/api/rooms?status=live" | jq
```

4. **Create a new room:**
```bash
PRODUCT_ID="..." # Get from products list
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"Test Live Session\",
    \"description\": \"Testing the platform\",
    \"products\": [\"$PRODUCT_ID\"],
    \"scheduledTime\": \"$(date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%S.000Z)\",
    \"maxViewers\": 100
  }" | jq
```

5. **Start the session:**
```bash
ROOM_ID="..." # Get from created room
curl -X POST http://localhost:5000/api/rooms/$ROOM_ID/start \
  -H "Authorization: Bearer $TOKEN" | jq
```

## WebSocket Testing

To test WebSocket functionality, you can use a WebSocket client or browser console:

```javascript
// In browser console after logging in
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_TOKEN_HERE' }
});

socket.on('connect', () => {
  console.log('Connected');
  
  // Join a room
  socket.emit('join-room', 'ROOM_ID');
});

socket.on('joined-room', (data) => {
  console.log('Joined room:', data);
});

socket.on('chat-message', (message) => {
  console.log('New message:', message);
});

// Send a chat message
socket.emit('chat-message', {
  roomId: 'ROOM_ID',
  message: 'Hello from the console!'
});
```

## Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
