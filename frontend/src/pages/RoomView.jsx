import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { roomAPI, productAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';

export default function RoomView() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [products, setProducts] = useState([]);
  
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadRoom();
    
    // Join room via socket
    socketService.joinRoom(id);

    // Socket event listeners
    socketService.on('joined-room', handleJoinedRoom);
    socketService.on('viewer-count', handleViewerCount);
    socketService.on('chat-message', handleChatMessage);
    socketService.on('product-spotlight', handleProductSpotlight);

    // TODO: Implement full WebRTC video streaming
    // For now, we'll use a placeholder
    initializePlaceholderVideo();

    return () => {
      socketService.leaveRoom(id);
      socketService.off('joined-room', handleJoinedRoom);
      socketService.off('viewer-count', handleViewerCount);
      socketService.off('chat-message', handleChatMessage);
      socketService.off('product-spotlight', handleProductSpotlight);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoom = async () => {
    try {
      const response = await roomAPI.getOne(id);
      setRoom(response.data);
      
      // Load product details
      if (response.data.products) {
        const productPromises = response.data.products.map(p => 
          productAPI.getOne(typeof p === 'string' ? p : p._id)
        );
        const productResponses = await Promise.all(productPromises);
        setProducts(productResponses.map(r => r.data));
      }
    } catch (error) {
      console.error('Error loading room:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializePlaceholderVideo = () => {
    // TODO: Implement full WebRTC video streaming
    // This is a placeholder for the video stream
    // In production, you would:
    // 1. Get media stream from seller
    // 2. Create peer connections
    // 3. Handle ICE candidates
    // 4. Display remote video stream
    console.log('TODO: Initialize WebRTC video streaming');
  };

  const handleJoinedRoom = (data) => {
    console.log('Joined room:', data);
    setViewerCount(data.viewerCount);
  };

  const handleViewerCount = (data) => {
    setViewerCount(data.viewerCount);
  };

  const handleChatMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleProductSpotlight = (data) => {
    console.log('Product spotlight:', data);
    // Highlight the product in the UI
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketService.sendChatMessage(id, newMessage);
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Room not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Room Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <img
                    src={room.seller?.avatar || 'https://via.placeholder.com/40'}
                    alt={room.seller?.username}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <span className="font-semibold">{room.seller?.username}</span>
                </div>
                {room.status === 'live' && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    🔴 LIVE
                  </span>
                )}
                <span className="text-gray-600">👥 {viewerCount} watching</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video and Chat Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
              {/* TODO: Replace with actual WebRTC video stream */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-xl font-semibold mb-2">Video Stream Placeholder</p>
                  <p className="text-sm text-gray-300">
                    TODO: Implement WebRTC video streaming
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    In production, this would show live video from the seller
                  </p>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Live Chat</h2>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="flex gap-2">
                      <img
                        src={msg.user.avatar || 'https://via.placeholder.com/40'}
                        alt={msg.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-semibold text-sm">{msg.user.username}</span>
                        <p className="text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded font-semibold"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
