import React, { useState, useEffect } from 'react';
import { Search, UtensilsCrossed, Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CUISINE_IMAGES = {
  'South Indian':       'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  'American Fast Food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'Italian, Pizzas':    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  'Chinese Cuisine':    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  'Healthy, Salads':    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

const ACCENT = '#C5F135';
const SURFACE_CARD = '#1C1C1C';
const SURFACE_ELEVATED = '#242424';
const BORDER = '#2E2E2E';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const imageSrc = restaurant.imageUrl || CUISINE_IMAGES[restaurant.cuisine] || FALLBACK_IMAGE;

  return (
    <div
      className="group rounded-2xl overflow-hidden flex flex-col transform hover:-translate-y-1 cursor-pointer transition-all duration-300 hover:shadow-2xl"
      style={{ backgroundColor: SURFACE_CARD, border: `1px solid ${BORDER}` }}
      onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Open/Closed badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${
          restaurant.isOpen ? 'text-black' : 'bg-red-500/90 text-white'
        }`} style={restaurant.isOpen ? { backgroundColor: ACCENT } : {}}>
          {restaurant.isOpen ? '● Open' : '● Closed'}
        </div>

        {/* Delivery time */}
        {restaurant.deliveryTime && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(6px)' }}>
            <Clock size={12} style={{ color: ACCENT }} />
            {restaurant.deliveryTime} min
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-bold text-white group-hover:text-brand transition-colors line-clamp-1" style={{ '--tw-text-opacity': 1 }}>
            {restaurant.name}
          </h3>
          {restaurant.rating && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ml-2 flex-shrink-0" style={{ backgroundColor: 'rgba(197,241,53,0.15)', color: ACCENT, border: `1px solid rgba(197,241,53,0.25)` }}>
              <Star size={11} className="fill-current" />
              {restaurant.rating}
            </div>
          )}
        </div>

        <p className="text-xs font-medium mb-1" style={{ color: ACCENT }}>{restaurant.cuisine}</p>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{restaurant.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center text-xs text-gray-500 gap-1.5 truncate max-w-[60%]">
            <MapPin size={12} className="text-gray-600 flex-shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(197,241,53,0.12)', color: ACCENT }}>
            {restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee} del`}
          </span>
        </div>

        {/* View Menu button */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: ACCENT, color: '#111111' }}
          onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}/menu`); }}
        >
          View Menu <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/api/restaurants/search?query=${encodeURIComponent(query)}`
        : '/api/restaurants';
      const response = await api.get(endpoint);
      setRestaurants(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      toast.error('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchRestaurants(searchQuery); };
  const handleClearSearch = () => { setSearchQuery(''); fetchRestaurants(''); };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
      {/* Hero Section */}
      <div className="py-16 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #111111 100%)' }}>
        {/* decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: ACCENT }} />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'rgba(197,241,53,0.12)', color: ACCENT, border: `1px solid rgba(197,241,53,0.25)` }}>
            <UtensilsCrossed size={14} /> Fast Delivery · Fresh Food
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Order Food That <br />
            <span style={{ color: ACCENT }}>Hits Different</span>
          </h1>
          <p className="text-base text-gray-500 mb-10 max-w-xl mx-auto">
            The best restaurants in your city — delivered fresh to your doorstep, faster than ever.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="restaurant-search"
              className="block w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-600 border outline-none transition-all text-sm"
              style={{ backgroundColor: '#1C1C1C', borderColor: '#2E2E2E', caretColor: ACCENT }}
              onFocus={(e) => e.target.style.borderColor = ACCENT}
              onBlur={(e) => e.target.style.borderColor = '#2E2E2E'}
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 font-bold rounded-xl px-5 transition-all hover:opacity-90 active:scale-95 text-sm"
              style={{ backgroundColor: ACCENT, color: '#111111' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : 'Popular Restaurants'}
            </h2>
            {!loading && (
              <p className="text-gray-600 mt-1 text-sm">
                {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'} found
              </p>
            )}
          </div>
          {searchQuery && !loading && (
            <button
              onClick={handleClearSearch}
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: ACCENT }}
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#1C1C1C', border: `1px solid #2E2E2E` }}>
            <UtensilsCrossed size={48} className="mx-auto mb-4" style={{ color: '#2E2E2E' }} />
            <h3 className="text-xl font-bold text-white mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No restaurants match "${searchQuery}". Try a different search term.`
                : 'No restaurants available right now. Please check back later.'}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-2 font-semibold hover:opacity-80 transition-opacity"
                style={{ color: ACCENT }}
              >
                Show all restaurants
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
