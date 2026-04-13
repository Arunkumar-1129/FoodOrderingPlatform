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

const ACCENT = '#C5F135';
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

  const getCartItem = (menuItemId) => cartItems.find((ci) => ci.menuItemId === menuItemId);

  const handleAddToCart = async (menuItem) => {
    if (!isAuthenticated) { toast('Please login to add items to cart', { icon: '🍽️' }); navigate('/login'); return; }
    if (!restaurant.isOpen) { toast.error('Restaurant is currently closed'); return; }
    setAddingItem(menuItem.id);
    await dispatch(addToCart({ menuItemId: menuItem.id, quantity: 1 }));
    setAddingItem(null);
  };

  const handleQuantityChange = async (menuItem, change) => {
    const cartItem = getCartItem(menuItem.id);
    if (!cartItem) return;
    const newQty = cartItem.quantity + change;
    if (newQty < 1) dispatch(removeFromCart(cartItem.id));
    else dispatch(updateCartItem({ menuItemId: menuItem.id, quantity: newQty }));
  };

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return (
    <div className="text-center py-20 text-gray-400" style={{ backgroundColor: '#111111', minHeight: '100vh' }}>
      Restaurant not found
    </div>
  );

  const categories = ['All', ...new Set(menuItems.map((i) => i.category || 'Other'))];
  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter((i) => i.category === activeCategory);
  const groupedMenu = filtered.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalCartItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#111111' }}>
      {/* Banner */}
      <div className="h-64 sm:h-80 w-full relative">
        <img
          src={restaurant.imageUrl || FALLBACK_BANNER}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = FALLBACK_BANNER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2.5 rounded-full flex items-center gap-1 transition-colors"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(8px)' }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">{restaurant.name}</h1>
              <p className="text-base font-medium" style={{ color: ACCENT }}>{restaurant.cuisine}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {restaurant.rating && (
                <div className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-bold" style={{ backgroundColor: 'rgba(197,241,53,0.15)', color: ACCENT, border: '1px solid rgba(197,241,53,0.25)', backdropFilter: 'blur(8px)' }}>
                  <Star size={14} className="fill-current" /> {restaurant.rating}
                </div>
              )}
              {restaurant.deliveryTime && (
                <div className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm text-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Clock size={14} className="opacity-70" /> {restaurant.deliveryTime} min
                </div>
              )}
              <div className={`px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-md ${
                restaurant.isOpen ? '' : 'bg-red-500/20 border border-red-400/30 text-red-300'
              }`} style={restaurant.isOpen ? { backgroundColor: 'rgba(197,241,53,0.15)', color: ACCENT, border: '1px solid rgba(197,241,53,0.25)' } : {}}>
                {restaurant.isOpen ? '● Open Now' : '● Closed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* About bar */}
        <div className="rounded-xl p-4 mb-6 text-sm flex flex-wrap gap-4 items-center justify-between" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={15} className="text-gray-600" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Delivery:</span>
            <span className="font-semibold" style={{ color: restaurant.deliveryFee === 0 ? ACCENT : '#fff' }}>
              {restaurant.deliveryFee === 0 ? 'Free' : formatCurrency(restaurant.deliveryFee)}
            </span>
          </div>
          {restaurant.description && (
            <p className="w-full text-gray-500 leading-relaxed text-xs">{restaurant.description}</p>
          )}
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={activeCategory === cat
                  ? { backgroundColor: ACCENT, color: '#111111' }
                  : { backgroundColor: '#1C1C1C', color: '#6b7280', border: '1px solid #2E2E2E' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12 rounded-xl text-gray-500" style={{ backgroundColor: '#1C1C1C' }}>
            No menu items available right now.
          </div>
        ) : (
          Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-10">
              {activeCategory === 'All' && (
                <h2 className="text-lg font-bold text-white mb-4 pb-2 inline-block" style={{ borderBottom: `2px solid ${ACCENT}` }}>
                  {category}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => {
                  const cartItem = getCartItem(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl flex items-start gap-4 transition-all"
                      style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                        {item.rating && (
                          <div className="flex items-center gap-1 mt-1 mb-1.5">
                            <Star size={11} className="fill-current" style={{ color: ACCENT }} />
                            <span className="text-xs text-gray-500 font-medium">{item.rating}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                        <p className="font-black text-white text-sm">{formatCurrency(item.price)}</p>
                        {!item.isAvailable && (
                          <span className="mt-2 inline-block text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Sold Out</span>
                        )}
                      </div>

                      {/* Image + Cart */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="h-24 w-24 rounded-xl overflow-hidden relative" style={{ border: '1px solid #2E2E2E' }}>
                          <img
                            src={item.imageUrl || FALLBACK_FOOD_IMAGE}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.src = FALLBACK_FOOD_IMAGE; }}
                          />
                          {!item.isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
                              <span className="text-white font-bold text-xs px-1 py-0.5 rounded">Sold Out</span>
                            </div>
                          )}
                        </div>

                        {cartItem ? (
                          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `2px solid ${ACCENT}` }}>
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="px-2.5 py-1.5 font-bold text-sm transition-colors"
                              style={{ backgroundColor: ACCENT, color: '#111111' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 py-1 font-bold text-sm" style={{ color: ACCENT }}>
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              className="px-2.5 py-1.5 font-bold text-sm transition-colors"
                              style={{ backgroundColor: ACCENT, color: '#111111' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable || !restaurant.isOpen || addingItem === item.id}
                            className={`w-24 py-2 rounded-lg flex items-center justify-center gap-1 font-bold text-xs transition-all ${
                              item.isAvailable && restaurant.isOpen
                                ? 'hover:opacity-90 active:scale-95'
                                : 'cursor-not-allowed opacity-40'
                            }`}
                            style={item.isAvailable && restaurant.isOpen
                              ? { backgroundColor: ACCENT, color: '#111111' }
                              : { backgroundColor: '#2E2E2E', color: '#6b7280' }
                            }
                          >
                            <Plus size={12} />
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

      {/* Floating cart */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: ACCENT, color: '#111111' }}
          >
            <div className="bg-black/20 rounded-lg px-2 py-0.5 text-xs font-black">{totalCartItems}</div>
            <ShoppingBag size={17} />
            View Cart & Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
