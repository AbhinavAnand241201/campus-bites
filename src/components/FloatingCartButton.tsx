import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const FloatingCartButton: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  // Don't show if cart is empty
  if (state.itemCount === 0) {
    return null;
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {state.itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </motion.div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          View Cart ({state.itemCount} items)
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </div>
    </motion.button>
  );
};

export default FloatingCartButton; 