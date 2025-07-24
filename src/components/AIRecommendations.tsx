import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  Heart, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Recommendation {
  id: string;
  type: 'trending' | 'personalized' | 'combo' | 'new';
  title: string;
  description: string;
  items: string[];
  confidence: number;
  reason: string;
}

const AIRecommendations = () => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  // Mock AI recommendations
  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'trending',
      title: '🔥 Trending Now',
      description: 'Most popular items this week',
      items: ['Butter Chicken', 'Cold Coffee', 'Masala Dosa'],
      confidence: 95,
      reason: 'High ratings and frequent orders'
    },
    {
      id: '2',
      type: 'personalized',
      title: '🎯 For You',
      description: 'Based on your preferences',
      items: ['Paneer Tikka', 'Masala Chai', 'Samosa'],
      confidence: 87,
      reason: 'Similar to items you\'ve ordered before'
    },
    {
      id: '3',
      type: 'combo',
      title: '💡 Smart Combo',
      description: 'Perfect meal combination',
      items: ['Butter Chicken + Naan + Cold Coffee'],
      confidence: 92,
      reason: 'Great value and complementary flavors'
    },
    {
      id: '4',
      type: 'new',
      title: '✨ New Arrival',
      description: 'Fresh additions to our menu',
      items: ['Biryani', 'Gulab Jamun'],
      confidence: 78,
      reason: 'New items with positive initial feedback'
    }
  ];

  const handleAddRecommendation = (recommendation: Recommendation) => {
    // Add the first item from the recommendation
    const itemName = recommendation.items[0].split(' + ')[0]; // Handle combo items
    
    // Mock item data - in real app, this would fetch from menu
    const mockItem = {
      id: `rec-${recommendation.id}`,
      name: itemName,
      price: 200,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Food',
      customization: {}
    };

    addItem(mockItem);
    setSelectedRecommendation(recommendation.id);
    
    // Reset selection after 2 seconds
    setTimeout(() => setSelectedRecommendation(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'personalized': return <Heart className="w-4 h-4" />;
      case 'combo': return <Zap className="w-4 h-4" />;
      case 'new': return <Star className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'personalized': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'combo': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'new': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="text-sm text-gray-500">Powered by AI</div>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              selectedRecommendation === recommendation.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => handleAddRecommendation(recommendation)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(recommendation.type)}`}>
                    {getTypeIcon(recommendation.type)}
                    <span className="ml-1">{recommendation.title}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {recommendation.confidence}% confidence
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    {recommendation.items.join(' + ')}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 italic">
                  💡 {recommendation.reason}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {selectedRecommendation === recommendation.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-primary-500 bg-opacity-10 rounded-lg flex items-center justify-center"
              >
                <div className="text-primary-600 font-medium">Added to cart! 🎉</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Recommendations are personalized based on your order history and preferences
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations; 