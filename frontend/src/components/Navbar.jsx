import React from 'react';
import { ShoppingCart, LogOut, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import useAuth from '../hooks/useAuth';

const Navbar = ({ onOpenCart }) => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ backgroundColor: '#111111', borderColor: '#2E2E2E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black tracking-tight" style={{ color: '#C5F135' }}>CraveBite</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Restaurants</Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
                )}
                <Link to="/orders" className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">My Orders</Link>

                <button
                  onClick={onOpenCart}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 rounded-full" style={{ backgroundColor: '#C5F135' }}>
                      {totalItems}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-4 border-l pl-4" style={{ borderColor: '#2E2E2E' }}>
                  <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User size={16} className="text-gray-500" /> {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="font-bold text-sm px-4 py-2 rounded-full transition-all hover:opacity-90"
                  style={{ backgroundColor: '#C5F135', color: '#111111' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {isAuthenticated && (
              <button onClick={onOpenCart} className="relative p-2 mr-3 text-gray-400">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 font-bold text-[10px] text-black text-center leading-5 rounded-full" style={{ backgroundColor: '#C5F135' }}>
                    {totalItems}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t" style={{ backgroundColor: '#1C1C1C', borderColor: '#2E2E2E' }}>
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link to="/" className="block py-2.5 text-base font-medium text-gray-400 hover:text-white transition-colors">Restaurants</Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block py-2.5 text-base font-medium text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                )}
                <Link to="/orders" className="block py-2.5 text-base font-medium text-gray-400 hover:text-white transition-colors">My Orders</Link>
                <div className="border-t mt-2 pt-3" style={{ borderColor: '#2E2E2E' }}>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User size={16} className="mr-2" /> {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 text-sm font-medium flex items-center gap-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t mt-2 pt-3 space-y-2" style={{ borderColor: '#2E2E2E' }}>
                <Link to="/login" className="block py-2 text-base font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="inline-block px-4 py-2 rounded-full font-bold text-sm" style={{ backgroundColor: '#C5F135', color: '#111111' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
