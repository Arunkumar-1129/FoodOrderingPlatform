import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { updateCartItem, removeFromCart, fetchCart } from '../store/cartSlice';

const ACCENT = '#C5F135';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalPrice, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && isAuthenticated) dispatch(fetchCart());
  }, [isOpen, isAuthenticated, dispatch]);

  const handleUpdateQuantity = (itemId, menuItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) dispatch(removeFromCart(itemId));
    else dispatch(updateCartItem({ menuItemId, quantity: newQuantity }));
  };

  const handleRemove = (itemId) => dispatch(removeFromCart(itemId));

  const handleCheckout = () => { onClose(); navigate('/checkout'); };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#1C1C1C', borderLeft: '1px solid #2E2E2E' }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #2E2E2E' }}>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag style={{ color: ACCENT }} size={20} />
            Your Cart
            {items && items.length > 0 && (
              <span className="text-xs font-black text-black px-2 py-0.5 rounded-full ml-1" style={{ backgroundColor: ACCENT }}>
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors text-gray-500 hover:text-white hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: ACCENT }} />
            </div>
          ) : !items || items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-12">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(197,241,53,0.08)' }}>
                <ShoppingBag size={40} style={{ color: 'rgba(197,241,53,0.3)' }} />
              </div>
              <p className="text-lg font-bold text-white">Your cart is empty</p>
              <p className="text-sm text-gray-600 text-center max-w-[200px]">Add items from a restaurant to get started!</p>
              <button
                onClick={onClose}
                className="mt-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:opacity-90"
                style={{ backgroundColor: ACCENT, color: '#111111' }}
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items[0]?.restaurantName && (
                <div className="flex items-center gap-2 pb-3 mb-1" style={{ borderBottom: '1px solid #2E2E2E' }}>
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-600">From</span>
                  <span className="font-bold text-white">{items[0].restaurantName}</span>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl transition-all"
                  style={{ backgroundColor: '#242424', border: '1px solid #2E2E2E' }}
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg" style={{ border: '1px solid #2E2E2E' }}>
                    <img
                      src={item.menuItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.menuItemName}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-white line-clamp-1 flex-1">{item.menuItemName}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `2px solid ${ACCENT}` }}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.menuItemId, item.quantity, -1)}
                          className="px-2 py-1 font-bold transition-colors"
                          style={{ backgroundColor: ACCENT, color: '#111111' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-3 py-1 font-black text-sm" style={{ color: ACCENT }}>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.menuItemId, item.quantity, 1)}
                          className="px-2 py-1 font-bold transition-colors"
                          style={{ backgroundColor: ACCENT, color: '#111111' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-600">{formatCurrency(item.price)} × {item.quantity}</p>
                        <p className="font-black text-white text-sm">{formatCurrency(item.subtotal)}</p>
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
          <div className="p-5" style={{ borderTop: '1px solid #2E2E2E', backgroundColor: '#1C1C1C' }}>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-gray-300 font-medium">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery fee</span>
                <span className="text-gray-400">calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid #2E2E2E' }}>
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-lg" style={{ color: ACCENT }}>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex justify-center items-center gap-2 rounded-xl py-4 text-sm font-black transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: ACCENT, color: '#111111' }}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
