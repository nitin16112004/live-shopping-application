import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            🛍️ Live Shopping
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/rooms" className="hover:text-primary-200">
              Live Rooms
            </Link>
            <Link to="/products" className="hover:text-primary-200">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative hover:text-primary-200">
                  🛒 Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <Link to="/dashboard" className="hover:text-primary-200">
                    Dashboard
                  </Link>
                )}

                <Link to="/orders" className="hover:text-primary-200">
                  Orders
                </Link>

                <div className="flex items-center space-x-4">
                  <span className="text-sm">👋 {user?.username}</span>
                  <button
                    onClick={logout}
                    className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
