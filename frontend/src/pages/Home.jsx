import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';

export default function Home() {
  const [liveRooms, setLiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLiveRooms();
  }, []);

  const loadLiveRooms = async () => {
    try {
      const response = await roomAPI.getAll({ status: 'live' });
      setLiveRooms(response.data);
    } catch (error) {
      console.error('Error loading live rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Live Shopping Platform
          </h1>
          <p className="text-xl mb-8">
            Experience real-time shopping with live video, interactive chat, and exclusive deals
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/rooms"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Live Rooms
            </Link>
            <Link
              to="/products"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>

      {/* Live Rooms Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">🔴 Live Now</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : liveRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {liveRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No live rooms at the moment</p>
            <Link
              to="/rooms"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View scheduled rooms →
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Shop Live?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📹</div>
              <h3 className="text-xl font-semibold mb-2">Live Video</h3>
              <p className="text-gray-600">
                Watch products in real-time with high-quality video streaming
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Chat</h3>
              <p className="text-gray-600">
                Ask questions and get instant answers from sellers
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Deals</h3>
              <p className="text-gray-600">
                Get access to limited-time offers and special prices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
