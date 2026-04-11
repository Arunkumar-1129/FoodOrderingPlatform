import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      PREPARING: 'bg-purple-100 text-purple-800 border-purple-200',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
             <Package size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
             <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                     {order.restaurantImageUrl && (
                        <img src={order.restaurantImageUrl} alt={order.restaurantName} className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                     )}
                     <div>
                        <h3 className="text-lg font-bold text-gray-900">{order.restaurantName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                           <Clock size={14} className="text-gray-400"/>
                           {new Date(order.createdAt).toLocaleString()}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className="font-extrabold text-lg text-gray-900">{formatCurrency(order.totalAmount)}</span>
                     <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                     </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Items</h4>
                        <ul className="space-y-2">
                           {order.items.map((item) => (
                           <li key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700"><span className="font-medium text-gray-900">{item.quantity}x</span> {item.menuItemName}</span>
                              <span className="text-gray-500 font-medium">{formatCurrency(item.price)}</span>
                           </li>
                           ))}
                        </ul>
                     </div>
                     
                     <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Delivery Details</h4>
                        <div className="text-sm text-gray-600 space-y-2 flex flex-col">
                           <span className="flex items-start gap-2">
                              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{order.deliveryAddress}</span>
                           </span>
                           {order.payment && (
                              <div className="mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                                 <span className="block font-medium text-gray-700 mb-1">Payment: {order.payment.method}</span>
                                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${order.payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
