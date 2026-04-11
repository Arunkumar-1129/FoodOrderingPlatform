import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { updateCartItem, removeFromCart, fetchCart } from '../store/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalPrice, isAuthenticated } = useSelector((state) => ({
    ...state.cart,
    isAuthenticated: state.auth.isAuthenticated
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isOpen, isAuthenticated, dispatch]);

  if (!isOpen) return null;

  const handleUpdateQuantity = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      dispatch(removeFromCart(itemId));
    } else {
      const item = items.find(i => i.id === itemId);
      dispatch(updateCartItem({ menuItemId: item.menuItemId, quantity: newQuantity }));
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/80">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-orange-600" /> Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!items || items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Restaurant Name Header (assuming all items from same restaurant) */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                 <span className="font-semibold text-gray-800">Restaurant:</span>
                 <span className="text-gray-600">{items[0]?.restaurantName}</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
                    <img 
                      src={item.menuItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} 
                      alt={item.menuItemName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 pr-2">{item.menuItemName}</h3>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 font-medium">{formatCurrency(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 hover:text-orange-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 font-medium text-sm text-gray-800 bg-white border-x">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 hover:text-orange-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items && items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4 bg-gray-50 p-4 rounded-lg">
              <p>Subtotal</p>
              <p className="text-lg text-orange-600 font-bold">{formatCurrency(totalPrice)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full flex justify-center items-center rounded-lg border border-transparent bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-orange-700 transition-all active:scale-[0.98]"
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
