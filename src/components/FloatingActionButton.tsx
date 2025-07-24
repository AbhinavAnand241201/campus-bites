import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, Heart, Star, Mic, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface FloatingActionButtonProps {
  onVoiceSearch?: () => void;
  onShowRecommendations?: () => void;
  onShowFavorites?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onVoiceSearch,
  onShowRecommendations,
  onShowFavorites
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, getTotalItems } = useCart();
  const { addToast } = useToast();

  const cartItemCount = getTotalItems();

  const actions = [
    {
      icon: Mic,
      label: 'Voice Search',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onVoiceSearch,
      show: !!onVoiceSearch
    },
    {
      icon: Sparkles,
      label: 'AI Recommendations',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: onShowRecommendations,
      show: !!onShowRecommendations
    },
    {
      icon: Heart,
      label: 'Favorites',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: onShowFavorites,
      show: !!onShowFavorites
    },
    {
      icon: Star,
      label: 'Rate App',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => {
        addToast({
          type: 'info',
          title: 'Rate Campus Bites',
          message: 'Thank you for using our app! Please rate us on the app store.'
        });
      },
      show: true
    }
  ].filter(action => action.show);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className={`${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative`}
              >
                <action.icon className="w-6 h-6" />
                <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Badge */}
        {cartItemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            {cartItemCount > 9 ? '9+' : cartItemCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton; 