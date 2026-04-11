import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

const FoodCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} 
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg px-4 py-2 bg-red-600 rounded-md shadow-lg transform -rotate-12 uppercase tracking-wider border-2 border-white">Currently Closed</span>
            </div>
          )}
          {restaurant.deliveryTime && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-medium text-sm text-gray-800">
               <Clock size={14} className="text-orange-500"/> {restaurant.deliveryTime} mins
            </div>
          )}
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{restaurant.name}</h3>
            {restaurant.rating && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-sm font-bold border border-green-100">
                <Star size={14} className="fill-current" />
                <span>{restaurant.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{restaurant.description || restaurant.cuisine}</p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center text-sm text-gray-500 gap-1.5 truncate max-w-[60%]">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{restaurant.location}</span>
            </div>
            {restaurant.deliveryFee !== undefined && (
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {restaurant.deliveryFee === 0 ? (
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">Free Delivery</span>
                ) : (
                  <>Fee: {formatCurrency(restaurant.deliveryFee)}</>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
