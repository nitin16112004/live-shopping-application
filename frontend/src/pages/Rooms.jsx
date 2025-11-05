import { useState, useEffect } from 'react';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRooms();
  }, [filter]);

  const loadRooms = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;

      const response = await roomAPI.getAll(params);
      setRooms(response.data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Rooms</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'live'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔴 Live Now
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📅 Scheduled
          </button>
          <button
            onClick={() => setFilter('ended')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'ended'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ended
          </button>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No rooms found</p>
          </div>
        )}
      </div>
    </div>
  );
}
