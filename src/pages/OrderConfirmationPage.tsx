import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  QrCode, 
  Copy, 
  Home,
  Menu,
  Receipt
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const { userData } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Try to load from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('campusBitesOrders') || '[]');
        const found = savedOrders.find((o: any) => o.id === orderId);
        if (found) {
          setOrder(found);
        }
      }
    }
  }, [orderId, getOrderById]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your order has been successfully placed</p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Order #{order.orderNumber}</h2>
                <p className="text-blue-100 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <span className="mr-1">{getStatusIcon(order.status)}</span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Order Items
            </h3>
            <div className="space-y-3 mb-6">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
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
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Pickup Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">Campus Canteen</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pickup Time:</span>
                  <span className="font-medium text-gray-900">{order.pickupTime}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <QrCode className="w-5 h-5 mr-2" />
                Show this QR code for pickup
              </h3>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 inline-block mb-4">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-gray-500">QR Code</p>
                    <p className="text-xs text-gray-400 mt-1">{order.qrCode}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Number */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Order Number</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="bg-white px-3 py-1 rounded border text-sm font-mono">
                    {order.orderNumber}
                  </code>
                  <button
                    onClick={() => copyToClipboard(order.orderNumber)}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Menu className="w-5 h-5" />
            <span>Order More</span>
          </button>
          <button
            onClick={() => navigate('/my-orders')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Receipt className="w-5 h-5" />
            <span>View Orders</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 rounded-lg p-4"
        >
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show the QR code to the canteen staff when picking up your order</li>
            <li>• You'll receive updates when your order is ready</li>
            <li>• Orders are typically ready within 15-20 minutes</li>
            <li>• Keep your order number handy for any queries</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 