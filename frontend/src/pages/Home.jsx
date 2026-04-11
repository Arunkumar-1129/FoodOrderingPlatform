import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';

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
      const endpoint = query ? `/api/restaurants/search?query=${query}` : '/api/restaurants';
      const response = await api.get(endpoint);
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchQuery);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-orange-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Craving something delicious?
          </h1>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Order food from the best restaurants in your city and get it delivered right to your doorstep.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 rounded-full text-gray-900 border-0 focus:ring-2 focus:ring-orange-300 shadow-xl text-lg outline-none"
              placeholder="Search for restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full px-6 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {searchQuery ? 'Search Results' : 'Popular Restaurants'}
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <FoodCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  fetchRestaurants();
                }}
                className="mt-4 text-orange-600 font-medium hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
