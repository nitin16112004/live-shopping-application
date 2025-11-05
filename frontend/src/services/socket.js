import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Room events
  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  sendChatMessage(roomId, message) {
    if (this.socket) {
      this.socket.emit('chat-message', { roomId, message });
    }
  }

  // WebRTC signaling
  sendWebRTCOffer(roomId, offer) {
    if (this.socket) {
      this.socket.emit('webrtc-offer', { roomId, offer });
    }
  }

  sendWebRTCAnswer(roomId, answer, targetUserId) {
    if (this.socket) {
      this.socket.emit('webrtc-answer', { roomId, answer, targetUserId });
    }
  }

  sendICECandidate(roomId, candidate, targetUserId) {
    if (this.socket) {
      this.socket.emit('webrtc-ice-candidate', { roomId, candidate, targetUserId });
    }
  }

  // Queue events
  joinQueue(roomId) {
    if (this.socket) {
      this.socket.emit('join-queue', { roomId });
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
