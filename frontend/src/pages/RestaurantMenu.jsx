import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, MapPin, ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { addToCart, updateCartItem, removeFromCart } from '../store/cartSlice';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const FALLBACK_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const cartItems = useSelector((state) => state.cart.items || []);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addingItem, setAddingItem] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          api.get(`/api/restaurants/${id}`),
          api.get(`/api/restaurants/${id}/menu`),
        ]);
        setRestaurant(resResponse.data.data);
        setMenuItems(menuResponse.data.data || []);
      } catch (error) {
        toast.error('Failed to load restaurant details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  // Get cart quantity for a menu item
  const getCartItem = (menuItemId) =>
    cartItems.find((ci) => ci.menuItemId === menuItemId);

  const handleAddToCart = async (menuItem) => {
    if (!isAuthenticated) {
      toast('Please login to add items to cart', { icon: '🍽️' });
      navigate('/login');
      return;
    }
    if (!restaurant.isOpen) {
      toast.error('Restaurant is currently closed');
      return;
    }
    setAddingItem(menuItem.id);
    await dispatch(addToCart({ menuItemId: menuItem.id, quantity: 1 }));
    setAddingItem(null);
  };

  const handleQuantityChange = async (menuItem, change) => {
    const cartItem = getCartItem(menuItem.id);
    if (!cartItem) return;

    const newQty = cartItem.quantity + change;
    if (newQty < 1) {
      dispatch(removeFromCart(cartItem.id));
    } else {
      dispatch(updateCartItem({ menuItemId: menuItem.id, quantity: newQty }));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!restaurant)
    return (
      <div className="text-center py-20 text-xl font-medium text-gray-600">
        Restaurant not found
      </div>
    );

  // Build category list
  const categories = ['All', ...new Set(menuItems.map((i) => i.category || 'Other'))];
  const filtered =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  // Group by category for "All" view
  const groupedMenu = filtered.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalCartItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Banner */}
      <div className="h-64 sm:h-80 w-full relative">
        <img
          src={restaurant.imageUrl || FALLBACK_BANNER}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = FALLBACK_BANNER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Restaurant Info overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-300 text-base">{restaurant.cuisine}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {restaurant.rating && (
                <div className="bg-white/15 backdrop-blur-md px-3 py-2 rounded-xl text-white flex items-center gap-2 border border-white/20">
                  <Star size={15} className="text-yellow-400 fill-current" />
                  <span className="font-bold text-sm">{restaurant.rating}</span>
                </div>
              )}
              {restaurant.deliveryTime && (
                <div className="bg-white/15 backdrop-blur-md px-3 py-2 rounded-xl text-white flex items-center gap-2 border border-white/20">
                  <Clock size={15} className="opacity-80" />
                  <span className="font-medium text-sm">{restaurant.deliveryTime} min</span>
                </div>
              )}
              <div className={`px-3 py-2 rounded-xl text-sm font-bold border backdrop-blur-md ${
                restaurant.isOpen
                  ? 'bg-green-500/20 border-green-400/30 text-green-300'
                  : 'bg-red-500/20 border-red-400/30 text-red-300'
              }`}>
                {restaurant.isOpen ? '● Open Now' : '● Closed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* About bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 text-gray-600 text-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} className="text-gray-400" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Delivery:</span>
            <span className="font-semibold text-gray-800">
              {restaurant.deliveryFee === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatCurrency(restaurant.deliveryFee)
              )}
            </span>
          </div>
          {restaurant.description && (
            <p className="w-full text-gray-500 leading-relaxed">{restaurant.description}</p>
          )}
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
                style={activeCategory === cat ? { backgroundColor: '#E8651A', borderColor: '#E8651A' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
            <p className="text-lg">No menu items available right now.</p>
          </div>
        ) : (
          Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-10">
              {activeCategory === 'All' && (
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-orange-100 inline-block">
                  {category}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item) => {
                  const cartItem = getCartItem(item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">{item.name}</h3>

                        {/* Item rating */}
                        {item.rating && (
                          <div className="flex items-center gap-1 mt-1 mb-2">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-500 font-medium">{item.rating}</span>
                          </div>
                        )}

                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <p className="font-extrabold text-gray-900 text-base">
                          {formatCurrency(item.price)}
                        </p>

                        {!item.isAvailable && (
                          <span className="mt-2 inline-block text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Image + Cart */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="h-24 w-24 rounded-xl overflow-hidden border border-gray-100 relative">
                          <img
                            src={item.imageUrl || FALLBACK_FOOD_IMAGE}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.src = FALLBACK_FOOD_IMAGE; }}
                          />
                          {!item.isAvailable && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <span className="text-red-600 font-bold text-xs bg-white px-1 py-0.5 rounded shadow">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quantity selector or Add button */}
                        {cartItem ? (
                          <div className="flex items-center border-2 rounded-lg overflow-hidden" style={{ borderColor: '#E8651A' }}>
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="px-2.5 py-1.5 text-white transition-colors"
                              style={{ backgroundColor: '#E8651A' }}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="px-3 py-1 font-bold text-sm" style={{ color: '#E8651A' }}>
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              className="px-2.5 py-1.5 text-white transition-colors"
                              style={{ backgroundColor: '#E8651A' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable || !restaurant.isOpen || addingItem === item.id}
                            className={`w-24 py-2 rounded-lg flex items-center justify-center gap-1 font-bold text-xs shadow-sm transition-all
                              ${item.isAvailable && restaurant.isOpen
                                ? 'text-white hover:opacity-90 active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            style={item.isAvailable && restaurant.isOpen ? { backgroundColor: '#E8651A' } : {}}
                          >
                            <Plus size={13} />
                            {addingItem === item.id ? '...' : 'ADD'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating cart summary (if cart has items) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm"
            style={{ backgroundColor: '#E8651A' }}
          >
            <div className="bg-white/20 rounded-lg px-2 py-0.5 text-xs font-bold">{totalCartItems}</div>
            <ShoppingBag size={18} />
            View Cart & Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
