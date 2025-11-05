const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ShoppingRoom = require('../models/ShoppingRoom');
const { getRedisClient } = require('../config/redis');

let io;

const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Join shopping room
    socket.on('join-room', async (roomId) => {
      try {
        const room = await ShoppingRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.status !== 'live') {
          socket.emit('error', { message: 'Room is not live' });
          return;
        }

        // Check max viewers limit
        const redisClient = getRedisClient();
        const roomViewersKey = `room:${roomId}:viewers`;
        const currentViewers = await redisClient.sCard(roomViewersKey);

        if (currentViewers >= room.maxViewers) {
          socket.emit('room-full', { message: 'Room is full' });
          return;
        }

        // Add user to room
        socket.join(roomId);
        await redisClient.sAdd(roomViewersKey, socket.user._id.toString());

        // Update viewer count
        const viewerCount = await redisClient.sCard(roomViewersKey);
        room.currentViewers = viewerCount;
        await room.save();

        socket.emit('joined-room', { roomId, viewerCount });
        io.to(roomId).emit('viewer-count', { viewerCount });

        console.log(`User ${socket.user.username} joined room ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Leave shopping room
    socket.on('leave-room', async (roomId) => {
      try {
        socket.leave(roomId);
        
        const redisClient = getRedisClient();
        const roomViewersKey = `room:${roomId}:viewers`;
        await redisClient.sRem(roomViewersKey, socket.user._id.toString());

        const viewerCount = await redisClient.sCard(roomViewersKey);
        const room = await ShoppingRoom.findById(roomId);
        if (room) {
          room.currentViewers = viewerCount;
          await room.save();
        }

        io.to(roomId).emit('viewer-count', { viewerCount });
        console.log(`User ${socket.user.username} left room ${roomId}`);
      } catch (error) {
        console.error('Leave room error:', error);
      }
    });

    // Chat message
    socket.on('chat-message', async (data) => {
      const { roomId, message } = data;
      
      const chatMessage = {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar
        },
        message,
        timestamp: new Date()
      };

      io.to(roomId).emit('chat-message', chatMessage);

      // Store in Redis for chat history
      try {
        const redisClient = getRedisClient();
        const chatKey = `room:${roomId}:chat`;
        await redisClient.rPush(chatKey, JSON.stringify(chatMessage));
        await redisClient.expire(chatKey, 86400); // 24 hours
      } catch (error) {
        console.error('Chat storage error:', error);
      }
    });

    // WebRTC signaling - Offer
    socket.on('webrtc-offer', (data) => {
      const { roomId, offer } = data;
      socket.to(roomId).emit('webrtc-offer', {
        userId: socket.user._id,
        username: socket.user.username,
        offer
      });
    });

    // WebRTC signaling - Answer
    socket.on('webrtc-answer', (data) => {
      const { roomId, answer, targetUserId } = data;
      io.to(roomId).emit('webrtc-answer', {
        userId: socket.user._id,
        targetUserId,
        answer
      });
    });

    // WebRTC signaling - ICE Candidate
    socket.on('webrtc-ice-candidate', (data) => {
      const { roomId, candidate, targetUserId } = data;
      io.to(roomId).emit('webrtc-ice-candidate', {
        userId: socket.user._id,
        targetUserId,
        candidate
      });
    });

    // Product spotlight (seller feature)
    socket.on('spotlight-product', async (data) => {
      const { roomId, productId } = data;
      
      // Verify seller
      const room = await ShoppingRoom.findById(roomId);
      if (room && room.seller.toString() === socket.user._id.toString()) {
        io.to(roomId).emit('product-spotlight', { productId });
      }
    });

    // Add to queue
    socket.on('join-queue', async (data) => {
      const { roomId } = data;
      const redisClient = getRedisClient();
      const queueKey = `room:${roomId}:queue`;
      
      const queueData = {
        userId: socket.user._id.toString(),
        username: socket.user.username,
        joinedAt: Date.now()
      };

      await redisClient.rPush(queueKey, JSON.stringify(queueData));
      const position = await redisClient.lLen(queueKey);

      socket.emit('queue-joined', { position });
      
      // Notify seller
      const room = await ShoppingRoom.findById(roomId);
      if (room) {
        io.to(roomId).emit('queue-updated', { queueLength: position });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);
      
      // Clean up all rooms
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      for (const roomId of rooms) {
        try {
          const redisClient = getRedisClient();
          const roomViewersKey = `room:${roomId}:viewers`;
          await redisClient.sRem(roomViewersKey, socket.user._id.toString());

          const viewerCount = await redisClient.sCard(roomViewersKey);
          const room = await ShoppingRoom.findById(roomId);
          if (room) {
            room.currentViewers = viewerCount;
            await room.save();
          }

          io.to(roomId).emit('viewer-count', { viewerCount });
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocketIO, getIO };
