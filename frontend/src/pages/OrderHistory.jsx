import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';

const ACCENT = '#C5F135';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my-orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      PENDING:          { backgroundColor: 'rgba(234,179,8,0.12)',   color: '#eab308',   border: '1px solid rgba(234,179,8,0.25)' },
      CONFIRMED:        { backgroundColor: 'rgba(59,130,246,0.12)',  color: '#60a5fa',   border: '1px solid rgba(59,130,246,0.25)' },
      PREPARING:        { backgroundColor: 'rgba(168,85,247,0.12)',  color: '#c084fc',   border: '1px solid rgba(168,85,247,0.25)' },
      OUT_FOR_DELIVERY: { backgroundColor: 'rgba(197,241,53,0.12)',  color: ACCENT,      border: `1px solid rgba(197,241,53,0.25)` },
      DELIVERED:        { backgroundColor: 'rgba(197,241,53,0.12)',  color: ACCENT,      border: `1px solid rgba(197,241,53,0.25)` },
      CANCELLED:        { backgroundColor: 'rgba(239,68,68,0.12)',   color: '#f87171',   border: '1px solid rgba(239,68,68,0.25)' },
    };
    return styles[status] || { backgroundColor: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid #2E2E2E' };
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
            <Package size={48} className="mx-auto mb-4" style={{ color: '#2E2E2E' }} />
            <h3 className="text-lg font-bold text-white mb-2">No orders found</h3>
            <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-xl" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
                {/* Header */}
                <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4" style={{ borderBottom: '1px solid #2E2E2E', backgroundColor: '#242424' }}>
                  <div className="flex items-center gap-4">
                    {order.restaurantImageUrl && (
                      <img src={order.restaurantImageUrl} alt={order.restaurantName} className="h-12 w-12 rounded-xl object-cover" style={{ border: '1px solid #2E2E2E' }} />
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white">{order.restaurantName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-gray-600" />
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-black text-lg text-white">{formatCurrency(order.totalAmount)}</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={getStatusStyle(order.status)}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2" style={{ borderBottom: '1px solid #2E2E2E' }}>Items</h4>
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              <span className="font-bold text-white">{item.quantity}×</span> {item.menuItemName}
                            </span>
                            <span className="text-gray-500 font-medium">{formatCurrency(item.price)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2" style={{ borderBottom: '1px solid #2E2E2E' }}>Delivery Details</h4>
                      <div className="text-sm text-gray-500 space-y-2">
                        <span className="flex items-start gap-2">
                          <MapPin size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed text-gray-400">{order.deliveryAddress}</span>
                        </span>
                        {order.payment && (
                          <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#2E2E2E' }}>
                            <span className="block font-medium text-gray-300 mb-1 text-xs">Payment: {order.payment.method}</span>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full inline-block"
                              style={order.payment.status === 'SUCCESS'
                                ? { backgroundColor: 'rgba(197,241,53,0.15)', color: ACCENT }
                                : { backgroundColor: 'rgba(234,179,8,0.12)', color: '#eab308' }
                              }
                            >
                              {order.payment.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
