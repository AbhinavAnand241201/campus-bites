import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, getTotalPrice, clearCart } = useCart();
  const { createOrder, state: orderState } = useOrder();
  const { userData } = useAuth();

  const [pickupTime, setPickupTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate available pickup times (every 15 minutes from now)
  const generatePickupTimes = () => {
    const times = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Start from next 15-minute interval
    let startMinute = Math.ceil(currentMinute / 15) * 15;
    if (startMinute === 60) {
      startMinute = 0;
    }
    
    for (let hour = currentHour; hour < 22; hour++) {
      for (let minute = startMinute; minute < 60; minute += 15) {
        if (hour === currentHour && minute <= currentMinute) continue;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
      startMinute = 0;
    }
    
    return times;
  };

  // Generate available dates (today and next 7 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const handleCheckout = async () => {
    if (!pickupTime || !selectedDate) {
      setError('Please select pickup date and time');
      return;
    }

    if (!userData) {
      setError('Please login to continue');
      return;
    }

    const totalAmount = getTotalPrice();
    if (userData.walletBalance < totalAmount) {
      setError('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        userId: userData.uid,
        userName: userData.name,
        items: cartState.items,
        totalAmount,
        pickupTime: new Date(`${selectedDate} ${pickupTime}`),
        status: 'pending' as const,
        paymentMethod: 'wallet' as const,
        createdAt: new Date()
      };

      const orderId = await createOrder(orderData);

      // Clear cart
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = getTotalPrice();
  const walletBalance = userData?.walletBalance || 0;
  const canCheckout = walletBalance >= totalAmount && cartState.items.length > 0;

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to checkout</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/48x48?text=🍽️';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Pickup Time Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pickup Time
              </h2>
              
              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a date</option>
                  {generateAvailableDates().map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {generatePickupTimes().map((time) => (
                    <button
                      key={time}
                      onClick={() => setPickupTime(time)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        pickupTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Checkout */}
          <div className="space-y-6">
            {/* Wallet Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">CB</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Campus Wallet</h3>
                      <p className="text-sm text-gray-500">Instant payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="font-semibold text-gray-900">₹{walletBalance}</p>
                  </div>
                </div>

                {!canCheckout && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-700 text-sm">
                        {walletBalance < totalAmount 
                          ? `Insufficient balance. Need ₹${totalAmount - walletBalance} more.`
                          : 'Please add items to cart.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleCheckout}
                disabled={!canCheckout || isProcessing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Place Order - ₹{totalAmount}</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 