import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';

const ACCENT = '#C5F135';

const getStatusStyle = (status) => {
  const styles = {
    PENDING:          { backgroundColor: 'rgba(234,179,8,0.12)',   color: '#eab308',   border: '1px solid rgba(234,179,8,0.25)' },
    CONFIRMED:        { backgroundColor: 'rgba(96,165,250,0.12)',  color: '#60a5fa',   border: '1px solid rgba(96,165,250,0.25)' },
    PREPARING:        { backgroundColor: 'rgba(192,132,252,0.12)', color: '#c084fc',   border: '1px solid rgba(192,132,252,0.25)' },
    OUT_FOR_DELIVERY: { backgroundColor: 'rgba(197,241,53,0.12)',  color: ACCENT,      border: `1px solid rgba(197,241,53,0.25)` },
    DELIVERED:        { backgroundColor: 'rgba(197,241,53,0.12)',  color: ACCENT,      border: `1px solid rgba(197,241,53,0.25)` },
    CANCELLED:        { backgroundColor: 'rgba(239,68,68,0.12)',   color: '#f87171',   border: '1px solid rgba(239,68,68,0.25)' },
  };
  return styles[status] || { backgroundColor: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid #2E2E2E' };
};

const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/admin/orders');
      setOrders(response.data.data);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = statusFilter === 'ALL' ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Orders',    value: orders.length },
    { label: 'Pending',         value: orders.filter((o) => o.status === 'PENDING').length },
    { label: 'Delivered',       value: orders.filter((o) => o.status === 'DELIVERED').length },
    { label: 'Revenue',         value: formatCurrency(orders.filter((o) => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0)) },
  ];

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package style={{ color: ACCENT }} size={28} /> Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-500">Filter:</label>
            <select
              className="pl-3 pr-8 py-2 text-sm rounded-xl text-white outline-none border font-semibold transition-all"
              style={{ backgroundColor: '#1C1C1C', borderColor: '#2E2E2E', accentColor: ACCENT }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = ACCENT}
              onBlur={(e) => e.target.style.borderColor = '#2E2E2E'}
            >
              <option value="ALL">All Orders</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value }) => (
            <div key={label} className="p-4 rounded-2xl" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-black" style={{ color: ACCENT }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: '#242424', borderBottom: '1px solid #2E2E2E' }}>
                  {['Order ID', 'Customer', 'Restaurant', 'Amount', 'Status', 'Action'].map((h) => (
                    <th key={h} scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid #2E2E2E',
                      backgroundColor: idx % 2 === 0 ? '#1C1C1C' : '#202020',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#242424'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#1C1C1C' : '#202020'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-white">#{order.id}</span>
                      <div className="text-xs text-gray-600 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-white">{order.userName}</div>
                      <div className="text-xs text-gray-500">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.restaurantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-white">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-full" style={getStatusStyle(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="pl-3 pr-6 py-1.5 text-xs rounded-lg text-white outline-none border font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        style={{ backgroundColor: '#2E2E2E', borderColor: '#3E3E3E', minWidth: '130px' }}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                        onFocus={(e) => e.target.style.borderColor = ACCENT}
                        onBlur={(e) => e.target.style.borderColor = '#3E3E3E'}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
