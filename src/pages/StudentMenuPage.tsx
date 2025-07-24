import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Heart, 
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../context/ToastContext';
import { menuItemsService, comboOffersService } from '../firebase/services';
import { MenuItem, ComboOffer } from '../firebase/services';
import { menuItems as fallbackMenuItems, comboOffers as fallbackComboOffers } from '../lib/sampleData';
import AIRecommendations from '../components/AIRecommendations';
import VoiceSearch from '../components/VoiceSearch';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FloatingActionButton from '../components/FloatingActionButton';

const StudentMenuPage = () => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [customization, setCustomization] = useState<any>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  // Categories
  const categories = ['All', 'Main Course', 'Breakfast', 'Beverages', 'Snacks', 'Desserts'];

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [menuData, comboData] = await Promise.all([
        menuItemsService.getAll(),
        comboOffersService.getActive()
      ]);
      
      setMenuItems(menuData);
      setComboOffers(comboData);
    } catch (error) {
      console.error('Failed to load menu data:', error);
      addToast({
        type: 'warning',
        title: 'Using Offline Data',
        message: 'Menu loaded from local cache due to connection issues.'
      });
      
      // Use fallback data
      setMenuItems(fallbackMenuItems as MenuItem[]);
      setComboOffers(fallbackComboOffers as ComboOffer[]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      customization: customization
    };
    
    addItem(cartItem);
    setCustomization({});
    setShowCustomization(false);
    
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.name} has been added to your cart!`
    });
  };

  const handleCustomizedAdd = () => {
    if (selectedItem) {
      handleAddToCart(selectedItem);
    }
  };

  const handleAddReview = () => {
    if (selectedItem && newReview.comment.trim()) {
      // In a real app, this would save to the database
      addToast({
        type: 'success',
        title: 'Review Added',
        message: 'Thank you for your review!'
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviews(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCombos = comboOffers.filter(combo => 
    combo.isActive && 
    new Date() >= new Date(combo.validUntil)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Campus Menu
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover delicious meals and quick bites
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => setVoiceSearchActive(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                🎤
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <AIRecommendations />
        </div>

        {/* Combo Offers */}
        {activeCombos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🎉 Special Combos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCombos.map((combo) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {combo.name}
                      </h3>
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                        Combo
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {combo.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary-600">
                          ₹{combo.discountedPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{combo.originalPrice}
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Save ₹{combo.originalPrice - combo.discountedPrice}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Add combo items to cart
                        combo.items.forEach(item => {
                          const menuItem = menuItems.find(m => m.id === item.id);
                          if (menuItem) {
                            addItem({
                              id: menuItem.id,
                              name: menuItem.name,
                              price: menuItem.price,
                              image: menuItem.image,
                              customization: {}
                            });
                          }
                        });
                        addToast({
                          type: 'success',
                          title: 'Combo Added',
                          message: `${combo.name} has been added to your cart!`
                        });
                      }}
                      className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Add Combo to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Menu Items ({filteredItems.length})
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {item.averageRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({item.totalReviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary-600">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.preparationTime} min
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowCustomization(true);
                        }}
                        disabled={!item.available}
                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Customize & Add
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowReviews(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* Voice Search Modal */}
        {voiceSearchActive && (
          <VoiceSearch
            onClose={() => setVoiceSearchActive(false)}
            onResult={(text) => {
              setSearchTerm(text);
              setVoiceSearchActive(false);
            }}
          />
        )}

        {/* Customization Modal */}
        {showCustomization && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customize {selectedItem.name}
                </h3>
                <button
                  onClick={() => setShowCustomization(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {selectedItem.customizationOptions?.spiceLevel && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spice Level
                  </label>
                  <select
                    value={customization.spiceLevel || ''}
                    onChange={(e) => setCustomization({...customization, spiceLevel: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="">Select spice level</option>
                    {selectedItem.customizationOptions.spiceLevel.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedItem.customizationOptions?.sugarLevel && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sugar Level
                  </label>
                  <select
                    value={customization.sugarLevel || ''}
                    onChange={(e) => setCustomization({...customization, sugarLevel: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="">Select sugar level</option>
                    {selectedItem.customizationOptions.sugarLevel.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCustomizedAdd}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setShowCustomization(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reviews Modal */}
        {showReviews && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reviews for {selectedItem.name}
                </h3>
                <button
                  onClick={() => setShowReviews(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedItem.reviews?.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        by {review.userName}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Add Your Review
                  </h4>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rating
                    </label>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setNewReview({...newReview, rating: i + 1})}
                          className="text-2xl"
                        >
                          {i < newReview.rating ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Comment
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      rows={3}
                      placeholder="Share your experience..."
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddReview}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => setShowReviews(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMenuPage; 