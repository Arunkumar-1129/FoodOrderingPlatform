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

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const imageSrc = restaurant.imageUrl || CUISINE_IMAGES[restaurant.cuisine] || FALLBACK_IMAGE;

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 cursor-pointer"
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
        {/* Open/Closed badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
          restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {restaurant.isOpen ? '● Open' : '● Closed'}
        </div>
        {/* Delivery time badge */}
        {restaurant.deliveryTime && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-medium text-sm text-gray-800">
            <Clock size={13} className="text-orange-500" />
            {restaurant.deliveryTime} min
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.rating && (
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-sm font-bold border border-orange-100 flex-shrink-0 ml-2">
              <Star size={13} className="fill-current" />
              {restaurant.rating}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-1 font-medium">{restaurant.cuisine}</p>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {restaurant.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center text-sm text-gray-500 gap-1.5 truncate max-w-[60%]">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
            {restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee} del`}
          </span>
        </div>

        {/* View Menu button */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{ backgroundColor: '#E8651A', color: '#fff' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c4511a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8651A'}
          onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}/menu`); }}
        >
          View Menu <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchRestaurants('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #E8651A 0%, #c4511a 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UtensilsCrossed size={40} className="text-white/80" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Craving something delicious?
          </h1>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Order from the best restaurants in your city — delivered fresh to your doorstep.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="restaurant-search"
              className="block w-full pl-12 pr-4 py-4 rounded-full text-gray-900 border-0 focus:ring-2 focus:ring-orange-300 shadow-xl text-base outline-none"
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full px-6 transition-colors shadow-sm text-sm"
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
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : 'Popular Restaurants'}
            </h2>
            {!loading && (
              <p className="text-gray-500 mt-1 text-sm">
                {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'} found
              </p>
            )}
          </div>
          {searchQuery && !loading && (
            <button
              onClick={handleClearSearch}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <UtensilsCrossed size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No restaurants match "${searchQuery}". Try a different search term.`
                : 'No restaurants available right now. Please check back later.'}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-2 text-orange-600 font-semibold hover:underline"
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
