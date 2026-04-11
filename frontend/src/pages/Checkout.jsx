import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { clearCart } from '../store/cartSlice';

const Checkout = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(false);

  // If cart is empty, redirect to home
  if (!items || items.length === 0) {
    navigate('/');
    return null;
  }

  const deliveryFee = items[0]?.restaurantId ? 40 : 0; // Simulated delivery fee
  const taxes = totalPrice * 0.05; // 5% tax
  const finalTotal = totalPrice + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please provide a delivery address');
      return;
    }

    setIsLoading(true);
    try {
      // Place Order
      const request = { deliveryAddress: address, paymentMethod };
      await api.post('/api/orders/place', request);
      
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder}>
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    rows="3"
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-6 border-t border-gray-100 pt-8">Payment Method</h2>
                <div className="space-y-4">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-3 font-semibold text-gray-900">Cash on Delivery</span>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <div className="ml-3">
                       <span className="block font-semibold text-gray-900">Credit / Debit Card</span>
                       <span className="block text-sm text-gray-500 mt-1">Processed securely (Simulation)</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="flow-root mb-6">
                <ul className="-my-4 divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex items-center gap-4">
                       <div className="h-16 w-16 flex-shrink-0 border border-gray-100 rounded-md overflow-hidden bg-gray-50">
                          <img src={item.menuItemImageUrl} alt={item.menuItemName} className="h-full w-full object-cover"/>
                       </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.menuItemName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between font-medium">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">{formatCurrency(totalPrice)}</dd>
                </div>
                <div className="flex justify-between font-medium">
                  <dt>Delivery Fee</dt>
                  <dd className="text-gray-900">{formatCurrency(deliveryFee)}</dd>
                </div>
                 <div className="flex justify-between font-medium">
                  <dt>Taxes (5%)</dt>
                  <dd className="text-gray-900">{formatCurrency(taxes)}</dd>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 text-lg">
                  <dt className="font-bold text-gray-900">Order Total</dt>
                  <dd className="font-extrabold text-orange-600">{formatCurrency(finalTotal)}</dd>
                </div>
              </dl>

              <button
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
