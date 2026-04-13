import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, CreditCard, Banknote, ShoppingBag, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { clearCart } from '../store/cartSlice';

const ACCENT = '#C5F135';

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, required, pattern, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      id={id} type={type} placeholder={placeholder} value={value}
      onChange={onChange} required={required} pattern={pattern} maxLength={maxLength}
      className="block w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 border outline-none transition-all text-sm"
      style={{ backgroundColor: '#242424', borderColor: '#2E2E2E', caretColor: ACCENT }}
      onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 3px rgba(197,241,53,0.12)`; }}
      onBlur={(e) => { e.target.style.borderColor = '#2E2E2E'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

const Checkout = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: user?.address || '', city: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if ((!items || items.length === 0) && !orderId) { navigate('/'); return null; }

  const deliveryFee = 40;
  const taxes = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) { toast.error('Please fill in all delivery details'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Please enter a valid 10-digit Indian mobile number'); return; }
    if (!/^\d{6}$/.test(pincode)) { toast.error('Please enter a valid 6-digit pincode'); return; }

    setIsLoading(true);
    const fullAddress = `${address}, ${city} - ${pincode}`;
    try {
      if (paymentMethod === 'ONLINE') {
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

  // ── Order Confirmation ────────────────────────────────────────────────────
  if (orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(197,241,53,0.12)' }}>
            <CheckCircle size={44} style={{ color: ACCENT }} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-500 mb-6">We're preparing your food and it'll be on its way soon!</p>

          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#242424', border: '1px solid #2E2E2E' }}>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-black text-white text-sm break-all">#{orderId}</p>
            <p className="text-xs text-gray-600 mt-2">Delivering to: {form.city}, {form.pincode}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: '#111111' }}
            >
              Track My Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-gray-400 border transition-colors hover:text-white"
              style={{ borderColor: '#2E2E2E', backgroundColor: 'transparent' }}
            >
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-colors text-gray-400 hover:text-white"
            style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight">Checkout</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Delivery Details */}
            <div className="p-6 md:p-8 rounded-2xl" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <ShoppingBag style={{ color: ACCENT }} size={20} /> Delivery Details
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name" id="fullname" placeholder="Arun Kumar" value={form.name} onChange={setField('name')} required />
                  <InputField label="Phone Number" id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={setField('phone')} required pattern="[6-9][0-9]{9}" maxLength={10} />
                </div>
                <InputField label="Address" id="address" placeholder="123, Main Street, Apartment 4B" value={form.address} onChange={setField('address')} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="City" id="city" placeholder="Chennai" value={form.city} onChange={setField('city')} required />
                  <InputField label="Pincode" id="pincode" type="tel" placeholder="600001" value={form.pincode} onChange={setField('pincode')} required pattern="\d{6}" maxLength={6} />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="p-6 md:p-8 rounded-2xl" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <CreditCard style={{ color: ACCENT }} size={20} /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'COD',    label: 'Cash on Delivery', sub: 'Pay when your order arrives', Icon: Banknote,    iconBg: 'rgba(197,241,53,0.12)', iconColor: ACCENT },
                  { value: 'ONLINE', label: 'Online Payment',   sub: 'UPI, Credit/Debit card (Simulated)', Icon: CreditCard, iconBg: 'rgba(96,165,250,0.12)', iconColor: '#60a5fa' },
                ].map(({ value, label, sub, Icon, iconBg, iconColor }) => (
                  <label
                    key={value}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border"
                    style={{
                      borderColor: paymentMethod === value ? ACCENT : '#2E2E2E',
                      backgroundColor: paymentMethod === value ? 'rgba(197,241,53,0.06)' : '#242424',
                    }}
                  >
                    <input
                      type="radio" name="paymentMethod" value={value}
                      checked={paymentMethod === value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4" style={{ accentColor: ACCENT }}
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: iconBg }}>
                        <Icon size={18} style={{ color: iconColor }} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{label}</p>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="mt-6 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="p-6 md:p-8 rounded-2xl sticky top-24" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
              <h2 className="text-lg font-black text-white mb-5">Order Summary</h2>

              {/* Items */}
              <ul className="-my-2 mb-5 max-h-64 overflow-y-auto space-y-1 scrollbar-hide" style={{ borderBottom: '1px solid #2E2E2E', paddingBottom: '1rem' }}>
                {items.map((item) => (
                  <li key={item.id} className="py-2.5 flex items-center gap-3">
                    <div className="h-11 w-11 flex-shrink-0 rounded-lg overflow-hidden" style={{ border: '1px solid #2E2E2E' }}>
                      <img
                        src={item.menuItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.menuItemName}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.menuItemName}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <div className="font-black text-white text-sm flex-shrink-0">{formatCurrency(item.subtotal)}</div>
                  </li>
                ))}
              </ul>

              {/* Price Breakdown */}
              <dl className="space-y-3 text-sm pt-1 mb-5">
                {[
                  { label: 'Subtotal',     value: formatCurrency(totalPrice) },
                  { label: 'Delivery Fee', value: formatCurrency(deliveryFee) },
                  { label: 'Taxes (5%)',   value: formatCurrency(taxes) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="text-gray-300 font-medium">{value}</dd>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid #2E2E2E' }}>
                  <dt className="font-black text-white text-base">Total</dt>
                  <dd className="font-black text-lg" style={{ color: ACCENT }}>{formatCurrency(finalTotal)}</dd>
                </div>
              </dl>

              {/* Place Order */}
              <button
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-black transition-all ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'
                }`}
                style={{ backgroundColor: ACCENT, color: '#111111' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    {paymentMethod === 'ONLINE' ? 'Processing Payment...' : 'Placing Order...'}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'ONLINE' ? <CreditCard size={17} /> : <Banknote size={17} />}
                    Place Order · {formatCurrency(finalTotal)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-600 text-center mt-3">By placing your order you agree to our Terms & Conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
