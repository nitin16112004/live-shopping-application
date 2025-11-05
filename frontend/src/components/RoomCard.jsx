import { Link } from 'react-router-dom';

export default function RoomCard({ room }) {
  const getStatusBadge = () => {
    const statusColors = {
      live: 'bg-red-500 animate-pulse',
      scheduled: 'bg-blue-500',
      ended: 'bg-gray-500'
    };

    return (
      <span className={`${statusColors[room.status]} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
        {room.status === 'live' ? '🔴 Live' : room.status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={room.products?.[0]?.images?.[0] || 'https://via.placeholder.com/400x200'}
          alt={room.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{room.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <img
              src={room.seller?.avatar || 'https://via.placeholder.com/40'}
              alt={room.seller?.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{room.seller?.username}</span>
          </div>
          
          {room.status === 'live' && (
            <div className="flex items-center text-red-600">
              👥 {room.currentViewers} watching
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600">
            📅 {new Date(room.scheduledTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            🛍️ {room.products?.length || 0} products
          </p>
        </div>

        <Link
          to={`/rooms/${room._id}`}
          className={`block text-center py-2 px-4 rounded font-semibold ${
            room.status === 'live'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {room.status === 'live' ? '🔴 Join Live Now' : 'View Room'}
        </Link>
      </div>
    </div>
  );
}
