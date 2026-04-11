import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, CreditCard, Banknote, ShoppingBag, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { clearCart } from '../store/cartSlice';

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, required, pattern, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
      className="block w-full px-3.5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm shadow-sm transition-shadow"
      style={{ '--tw-ring-color': '#E8651A' }}
      onFocus={(e) => { e.target.style.borderColor = '#E8651A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,101,26,0.15)'; }}
      onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

const Checkout = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: user?.address || '',
    city: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Redirect if cart is empty (and no confirmed order)
  if ((!items || items.length === 0) && !orderId) {
    navigate('/');
    return null;
  }

  const deliveryFee = 40;
  const taxes = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) {
      toast.error('Please fill in all delivery details');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);
    const fullAddress = `${address}, ${city} - ${pincode}`;

    try {
      if (paymentMethod === 'ONLINE') {
        // Simulate online payment processing
        await new Promise((res) => setTimeout(res, 2000));
        toast.success('Payment Successful! 🎉');
      }

      const request = { deliveryAddress: fullAddress, paymentMethod };
      const response = await api.post('/api/orders/place', request);
      const placedOrderId = response.data?.data?.id || response.data?.data?.orderId || 'ORD-' + Date.now();

      setOrderId(placedOrderId);
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎊');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Order Confirmation Screen ─────────────────────────────────────────────
  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#fff7f2' }}>
            <CheckCircle size={48} style={{ color: '#E8651A' }} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-500 mb-4">
            Thank you for your order. We're preparing your food and it'll be on its way soon!
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-bold text-gray-800 text-sm break-all">#{orderId}</p>
            <p className="text-xs text-gray-400 mt-2">
              Delivering to: {form.city}, {form.pincode}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full py-3 rounded-xl text-white font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#E8651A' }}
            >
              Track My Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ─────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag style={{ color: '#E8651A' }} size={20} />
                Delivery Details
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name" id="fullname" placeholder="Arun Kumar"
                    value={form.name} onChange={setField('name')} required
                  />
                  <InputField
                    label="Phone Number" id="phone" type="tel" placeholder="9876543210"
                    value={form.phone} onChange={setField('phone')} required
                    pattern="[6-9][0-9]{9}" maxLength={10}
                  />
                </div>
                <InputField
                  label="Address" id="address" placeholder="123, Main Street, Apartment 4B"
                  value={form.address} onChange={setField('address')} required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="City" id="city" placeholder="Chennai"
                    value={form.city} onChange={setField('city')} required
                  />
                  <InputField
                    label="Pincode" id="pincode" type="tel" placeholder="600001"
                    value={form.pincode} onChange={setField('pincode')} required
                    pattern="\d{6}" maxLength={6}
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard style={{ color: '#E8651A' }} size={20} />
                Payment Method
              </h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-orange-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  style={paymentMethod === 'COD' ? { borderColor: '#E8651A' } : {}}
                >
                  <input
                    type="radio" name="paymentMethod" value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                    style={{ accentColor: '#E8651A' }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Banknote size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives</p>
                    </div>
                  </div>
                </label>

                {/* Online Payment */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'bg-orange-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  style={paymentMethod === 'ONLINE' ? { borderColor: '#E8651A' } : {}}
                >
                  <input
                    type="radio" name="paymentMethod" value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                    style={{ accentColor: '#E8651A' }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Online Payment</p>
                      <p className="text-xs text-gray-500">UPI, Credit/Debit card (Simulated)</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Items list */}
              <ul className="-my-2 divide-y divide-gray-50 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={item.menuItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.menuItemName}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.menuItemName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <div className="font-bold text-gray-800 text-sm flex-shrink-0">{formatCurrency(item.subtotal)}</div>
                  </li>
                ))}
              </ul>

              {/* Price breakdown */}
              <dl className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-800 font-medium">{formatCurrency(totalPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery Fee</dt>
                  <dd className="text-gray-800 font-medium">{formatCurrency(deliveryFee)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes (5%)</dt>
                  <dd className="text-gray-800 font-medium">{formatCurrency(taxes)}</dd>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-base">
                  <dt className="font-bold text-gray-900">Total</dt>
                  <dd className="font-extrabold text-lg" style={{ color: '#E8651A' }}>{formatCurrency(finalTotal)}</dd>
                </div>
              </dl>

              {/* Place order button */}
              <button
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-base font-bold text-white shadow-lg transition-all ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'
                }`}
                style={{ backgroundColor: '#E8651A' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {paymentMethod === 'ONLINE' ? 'Processing Payment...' : 'Placing Order...'}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'ONLINE' ? <CreditCard size={18} /> : <Banknote size={18} />}
                    Place Order • {formatCurrency(finalTotal)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing your order you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
