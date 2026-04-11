import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { updateCartItem, removeFromCart, fetchCart } from '../store/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalPrice, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isOpen, isAuthenticated, dispatch]);

  const handleUpdateQuantity = (itemId, menuItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItem({ menuItemId, quantity: newQuantity }));
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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ backgroundColor: '#fff7f2' }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag style={{ color: '#E8651A' }} size={22} />
            Your Cart
            {items && items.length > 0 && (
              <span className="text-sm font-semibold text-white px-2 py-0.5 rounded-full ml-1" style={{ backgroundColor: '#E8651A' }}>
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#E8651A' }} />
            </div>
          ) : !items || items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-12">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={42} className="text-orange-200" />
              </div>
              <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
              <p className="text-sm text-gray-400 text-center max-w-[200px]">
                Add items from a restaurant to get started!
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors text-white"
                style={{ backgroundColor: '#E8651A' }}
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Restaurant name header */}
              {items[0]?.restaurantName && (
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-400">From</span>
                  <span className="font-bold text-gray-800">{items[0].restaurantName}</span>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                >
                  {/* Item image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    <img
                      src={item.menuItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.menuItemName}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; }}
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">{item.menuItemName}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border-2 rounded-lg overflow-hidden" style={{ borderColor: '#E8651A' }}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.menuItemId, item.quantity, -1)}
                          className="px-2 py-1 text-white transition-colors"
                          style={{ backgroundColor: '#E8651A' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 font-bold text-sm" style={{ color: '#E8651A' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.menuItemId, item.quantity, 1)}
                          className="px-2 py-1 text-white transition-colors"
                          style={{ backgroundColor: '#E8651A' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{formatCurrency(item.price)} × {item.quantity}</p>
                        <p className="font-bold text-gray-900 text-sm">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items && items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.06)]">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-gray-700">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery fee</span>
                <span className="font-medium text-gray-700">calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-lg" style={{ color: '#E8651A' }}>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex justify-center items-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] hover:opacity-90"
              style={{ backgroundColor: '#E8651A' }}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
