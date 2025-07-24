import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Wallet
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const { state, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleCheckout = () => {
    if (state.items.length === 0) {
      addToast({
        type: 'warning',
        title: 'Empty Cart',
        message: 'Please add items to your cart before checkout.'
      });
      return;
    }

    if (!userData) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please login to proceed with checkout.'
      });
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    addToast({
      type: 'success',
      title: 'Cart Cleared',
      message: 'All items have been removed from your cart.'
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
          </div>

          {/* Empty Cart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious items to your cart yet. 
              Start exploring our menu to find something tasty!
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Menu
            </button>
          </motion.div>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({state.itemCount})
                </h2>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/80x80?text=🍽️';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <p className="text-lg font-semibold text-primary-600 mt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{Math.round(getTotalPrice() * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₹0</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Wallet Info */}
            {userData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Wallet className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Wallet Balance</h3>
                </div>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  ₹{userData.walletBalance || 0}
                </p>
                <p className="text-sm text-gray-500">
                  Available for payment
                </p>
              </motion.div>
            )}

            {/* Checkout Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </motion.button>

            {/* Continue Shopping */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate('/menu')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 