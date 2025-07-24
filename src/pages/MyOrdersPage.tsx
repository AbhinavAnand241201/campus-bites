import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter,
  Eye,
  QrCode,
  Calendar,
  MapPin,
  Receipt,
  ArrowLeft
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { getUserOrders, state: orderState } = useOrder();
  const { userData } = useAuth();
  
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user orders
  useEffect(() => {
    if (userData) {
      getUserOrders().then(() => {
      setLoading(false);
      });
    }
  }, [userData, getUserOrders]);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orderState.orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((order: any) =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: any) => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order: any) => order.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(filtered);
  }, [orderState.orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'preparing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is waiting to be prepared';
      case 'preparing': return 'Your order is being prepared in the kitchen';
      case 'ready': return 'Your order is ready for pickup!';
      case 'completed': return 'Order has been collected successfully';
      case 'cancelled': return 'Order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
                <p className="text-sm text-gray-600">Track your order history</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Order More
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {['pending', 'preparing', 'ready', 'completed'].map((status) => (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orderState.orders.filter((order: any) => order.status === status).length}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl`}>
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {orderState.orders.length === 0 
                ? "You haven't placed any orders yet. Start by browsing our menu!"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {orderState.orders.length === 0 && (
              <button
                onClick={() => navigate('/menu')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {getStatusDescription(order.status)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Pickup: {order.pickupTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Receipt className="w-4 h-4" />
                            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">₹{order.totalAmount}</p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item: any, index: number) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {item.name} (x{item.quantity})
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 pt-4 mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View Details</span>
                        </button>
                        {order.status === 'ready' && (
                          <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors">
                            <QrCode className="w-4 h-4" />
                            <span className="text-sm">Show QR Code</span>
                          </button>
                        )}
                      </div>
                      {order.status === 'ready' && (
                        <div className="text-green-600 text-sm font-medium">
                          🎉 Ready for pickup!
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      <span className="mr-1">{getStatusIcon(selectedOrder.status)}</span>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">{getStatusDescription(selectedOrder.status)}</p>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Order Date</span>
                    </div>
                    <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Pickup Time</span>
                    </div>
                    <p className="text-gray-900">{selectedOrder.pickupTime}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/40x40?text=🍽️';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                {/* QR Code for Ready Orders */}
                {selectedOrder.status === 'ready' && (
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
                      <QrCode className="w-5 h-5 mr-2" />
                      Show this QR code for pickup
                    </h3>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 inline-block">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">📱</div>
                          <p className="text-sm text-gray-500">QR Code</p>
                          <p className="text-xs text-gray-400 mt-1">{selectedOrder.qrCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrdersPage; 