import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Clock, Info, Plus } from 'lucide-react';
import api from '../services/api';
import { addToCart } from '../store/cartSlice';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          api.get(`/api/restaurants/${id}`),
          api.get(`/api/restaurants/${id}/menu`)
        ]);
        setRestaurant(resResponse.data.data);
        setMenuItems(menuResponse.data.data);
      } catch (error) {
        toast.error('Failed to load restaurant details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

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

    dispatch(addToCart({ menuItemId: menuItem.id, quantity: 1 }));
  };

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return <div className="text-center py-20 text-xl font-medium">Restaurant not found</div>;

  // Group items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Restaurant Header */}
      <div className="h-64 sm:h-80 w-full relative">
        <img 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">{restaurant.name}</h1>
              <p className="text-gray-200 text-lg">{restaurant.cuisine}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {restaurant.rating && (
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white flex items-center border border-white/20">
                  <Star size={18} className="text-yellow-400 mr-2 fill-current" />
                  <span className="font-bold">{restaurant.rating}</span>
                </div>
              )}
              {restaurant.deliveryTime && (
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white flex items-center border border-white/20">
                  <Clock size={18} className="mr-2 opacity-80" />
                  <span className="font-medium">{restaurant.deliveryTime} mins</span>
                </div>
              )}
               <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white flex items-center border border-white/20">
                  <Info size={18} className="mr-2 opacity-80" />
                  <span className="font-medium">
                     {restaurant.isOpen ? (
                        <span className="text-green-400 font-bold">Open Now</span>
                     ) : (
                        <span className="text-red-400 font-bold">Closed</span>
                     )}
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-gray-600">
           <h3 className="font-semibold text-gray-900 mb-2">About</h3>
           <p className="text-sm md:text-base leading-relaxed">{restaurant.description}</p>
           <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm font-medium">
               <span>Location: <span className="text-gray-900">{restaurant.location}</span></span>
               <span>Delivery Fee: <span className="text-gray-900">{restaurant.deliveryFee === 0 ? 'Free' : formatCurrency(restaurant.deliveryFee)}</span></span>
           </div>
        </div>

        {/* Menu Section */}
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 pb-2 border-b-2 border-gray-100 inline-block">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border text-left border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    </div>
                    <p className="font-bold text-gray-900 mt-1 mb-2">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-lg overflow-hidden border border-gray-100 mb-3 relative">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                           <span className="text-red-600 font-bold text-xs bg-white px-1 py-0.5 rounded shadow">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable || !restaurant.isOpen}
                      className={`w-full py-1.5 px-3 rounded-full flex items-center justify-center gap-1 font-bold text-sm shadow-sm transition-all
                        ${item.isAvailable && restaurant.isOpen
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white border border-transparent' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                      `}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
             <p className="text-lg">No menu items available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
