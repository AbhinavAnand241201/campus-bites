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
  RefreshCw,
  Loader2,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const OrderManagementPage: React.FC = () => {
  const { state: orderState, updateOrderStatus } = useOrder();
  const { userData } = useAuth();
  
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedQR, setScannedQR] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orderState.orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: any) => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(filtered);
  }, [orderState.orders, searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus as any);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const handleQRScan = (qrCode: string) => {
    setScannedQR(qrCode);
    const order = orderState.orders.find(o => o.qrCode === qrCode);
    if (order) {
      setSelectedOrder(order);
      // Auto-update status to completed when QR is scanned
      handleStatusUpdate(order.id, 'completed');
    }
    setShowQRScanner(false);
  };

  const simulateQRScan = () => {
    if (orderState.orders.length > 0) {
      const randomOrder = orderState.orders[Math.floor(Math.random() * orderState.orders.length)];
      handleQRScan(randomOrder.qrCode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all orders in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={simulateQRScan}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <QrCode className="w-5 h-5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {['pending', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
          <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderState.orders.filter(order => order.status === status).length}
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by number, customer, or items..."
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
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ₹{order.totalAmount}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.userName}</div>
                      <div className="text-sm text-gray-500">ID: {order.userId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.pickupTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status)!)}
                            disabled={loading}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                            title={`Mark as ${getNextStatus(order.status)}`}
                          >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleQRScan(order.qrCode)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Scan QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Customer</span>
                    </div>
                    <p className="text-gray-900">{selectedOrder.userName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
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

                {/* QR Code */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">QR Code for Pickup</h3>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4 inline-block">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-1">📱</div>
                        <p className="text-xs text-gray-500">{selectedOrder.qrCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQRScanner(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code Scanner</h2>
              <div className="text-center">
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Scanner Interface</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Point your camera at the QR code to scan
                </p>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close Scanner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagementPage; 