import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, TrendingUp, Heart, Star } from 'lucide-react';
import { menuItems } from '../lib/sampleData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Recommendation {
  id: string;
  type: 'trending' | 'personalized' | 'combo' | 'healthy';
  title: string;
  description: string;
  items: any[];
  confidence: number;
}

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { userData } = useAuth();

  // Simulate AI recommendations based on user behavior
  useEffect(() => {
    const generateRecommendations = () => {
      const userOrderHistory = JSON.parse(localStorage.getItem('userOrderHistory') || '[]');
      const popularItems = [...menuItems].sort((a, b) => b.salesCount - a.salesCount);
      
      const recs: Recommendation[] = [
        {
          id: 'trending-1',
          type: 'trending',
          title: '🔥 Trending Now',
          description: 'Most popular items this week',
          items: popularItems.slice(0, 3),
          confidence: 0.95
        },
        {
          id: 'healthy-1',
          type: 'healthy',
          title: '🥗 Healthy Choices',
          description: 'Nutritious options for you',
          items: menuItems.filter(item => item.category === 'Main Course').slice(0, 2),
          confidence: 0.87
        },
        {
          id: 'personalized-1',
          type: 'personalized',
          title: '✨ Personalized for You',
          description: 'Based on your preferences',
          items: menuItems.filter(item => item.averageRating > 4.5).slice(0, 2),
          confidence: 0.92
        }
      ];

      setRecommendations(recs);
      setIsLoading(false);
    };

    // Simulate AI processing time
    setTimeout(generateRecommendations, 1500);
  }, []);

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'personalized':
        return <Sparkles className="w-5 h-5" />;
      case 'healthy':
        return <Heart className="w-5 h-5" />;
      case 'combo':
        return <Star className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600 dark:text-gray-400">AI is analyzing your preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-2 mb-4">
                {getRecommendationIcon(rec.type)}
                <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                <span className={`text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                  {(rec.confidence * 100).toFixed(0)}% match
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec.description}</p>
              
              <div className="space-y-3">
                {rec.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.averageRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIRecommendations; 