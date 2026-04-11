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
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600 tracking-tight">CraveBite</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Restaurants</Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
                )}
                <Link to="/orders" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">My Orders</Link>
                
                <button
                  onClick={onOpenCart}
                  className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-4 border-l pl-4">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User size={18} /> {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors">Login</Link>
                <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-orange-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {isAuthenticated && (
              <button onClick={onOpenCart} className="relative p-2 mr-4 text-gray-600">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 bg-red-600 text-white text-[10px] text-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600">Restaurants</Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600">Dashboard</Link>
                )}
                <Link to="/orders" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600">My Orders</Link>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="px-4 py-2 flex items-center text-sm text-gray-500">
                    <User size={18} className="mr-2" /> {user?.name} ({user?.email})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" className="block px-4 py-2 text-base font-medium text-orange-600 hover:bg-gray-50">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
