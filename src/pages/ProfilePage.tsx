import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Wallet, 
  CreditCard, 
  History, 
  Settings, 
  Edit, 
  Save, 
  X,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const { state: orderState } = useOrder();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || ''
  });
  const [walletAmount, setWalletAmount] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState<'add' | 'withdraw'>('add');

  // Recent orders (last 5)
  const recentOrders = orderState.orders.slice(0, 5);

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(editForm);
      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    }
  };

  const handleWalletAction = () => {
    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount.'
      });
      return;
    }

    // In a real app, this would call an API
    addToast({
      type: 'success',
      title: walletAction === 'add' ? 'Amount Added' : 'Amount Withdrawn',
      message: `₹${amount} ${walletAction === 'add' ? 'added to' : 'withdrawn from'} your wallet.`
    });

    setWalletAmount('');
    setShowWalletModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'preparing': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Profile & Wallet</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <p className="text-gray-500">Manage your account details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{userData?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{userData?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-gray-900 capitalize">{userData?.role}</p>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <History className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <button
                  onClick={() => navigate('/my-orders')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{order.totalAmount} • {order.items.length} items
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Start ordering
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Wallet Section */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Wallet className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Wallet</h2>
              </div>

              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-primary-600">
                  ₹{userData?.walletBalance || 0}
                </p>
                <p className="text-gray-500">Available Balance</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setWalletAction('add');
                    setShowWalletModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Money</span>
                </button>
                <button
                  onClick={() => {
                    setWalletAction('withdraw');
                    setShowWalletModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">{orderState.orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">
                    {orderState.orders.filter(order => {
                      const orderDate = new Date(order.createdAt);
                      const now = new Date();
                      return orderDate.getMonth() === now.getMonth() && 
                             orderDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-medium">
                    ₹{orderState.orders.reduce((total, order) => total + order.totalAmount, 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {walletAction === 'add' ? 'Add Money' : 'Withdraw Money'}
              </h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWalletAction}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {walletAction === 'add' ? 'Add' : 'Withdraw'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 