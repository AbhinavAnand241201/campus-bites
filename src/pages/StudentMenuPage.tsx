import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { canteenName, groupOrderBonuses, menuItems as fallbackMenuItems } from '../lib/sampleData';
import { menuItemsService, comboOffersService, MenuItem, ComboOffer } from '../firebase/services';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Tag, Settings, MessageSquare, Plus, Minus, Search, Filter, Sparkles, Mic } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../context/ToastContext';
import AIRecommendations from '../components/AIRecommendations';
import VoiceSearch from '../components/VoiceSearch';
import { MenuItemSkeleton } from '../components/LoadingSkeleton';
import FloatingActionButton from '../components/FloatingActionButton';

const StudentMenuPage: React.FC = () => {
  const { addItem } = useCart();
  const { userData } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [customization, setCustomization] = useState<any>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);

  // Get active combo offers for today
  const activeCombos = comboOffers.filter(combo => {
    const today = new Date();
    return combo.active && 
           combo.validFrom <= today && 
           combo.validTo >= today;
  });

  // Check if user is eligible for group bonus
  const groupBonus = groupOrderBonuses.find(bonus => bonus.isActive);

  const handleAddToCart = (item: MenuItem) => {
    if (item.customizationOptions) {
      setSelectedItem(item);
      setShowCustomization(true);
    } else {
      addItem({
        id: item.id || '',
        name: item.name,
        price: item.price,
        image: item.image
      });
    }
  };

  const handleCustomizedAdd = () => {
    if (selectedItem) {
      const customizedItem = {
        id: selectedItem.id || '',
        name: selectedItem.name,
        price: selectedItem.price,
        image: selectedItem.image,
        customization: customization
      };
      addItem(customizedItem);
      setShowCustomization(false);
      setCustomization({});
      setSelectedItem(null);
    }
  };

  const handleAddReview = () => {
    if (selectedItem && newReview.comment) {
      // In a real app, this would be saved to the backend
      addToast({
        type: 'success',
        title: 'Review Added',
        message: `Thank you for your review of ${selectedItem.name}!`
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviews(false);
    }
  };

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [menuData, comboData] = await Promise.all([
          menuItemsService.getAll(),
          comboOffersService.getActive()
        ]);
        setMenuItems(menuData);
        setComboOffers(comboData);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          type: 'warning',
          title: 'Using Fallback Data',
          message: 'Using offline menu data. Some features may be limited.'
        });
        // Use fallback data
        setMenuItems(fallbackMenuItems);
        setComboOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [addToast]);

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {canteenName}
        </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {userData?.name}!</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Wallet Balance: ₹{userData?.walletBalance}</p>
        </div>

        {/* AI Recommendations Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span>{showAIRecommendations ? 'Hide' : 'Show'} AI Recommendations</span>
          </button>
        </div>

        {/* AI Recommendations */}
        {showAIRecommendations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <AIRecommendations />
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <VoiceSearch onSearch={handleSearch} isListening={isListening} setIsListening={setIsListening} />
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Group Bonus Alert */}
        {groupBonus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg mb-6 flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">
              Group orders above ₹{groupBonus.minimumAmount} get {groupBonus.bonusCredits} bonus credits!
            </span>
          </motion.div>
        )}

        {/* Combo Offers */}
        {activeCombos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Tag className="w-6 h-6 mr-2 text-orange-600" />
              Today's Special Combos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCombos.map((combo) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-md border border-orange-200 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{combo.name}</h3>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                      Special Offer
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{combo.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm line-through text-gray-500">₹{combo.originalPrice}</span>
                      <span className="text-lg font-bold text-green-600">₹{combo.discountedPrice}</span>
                    </div>
                    <button
                      onClick={() => {
                        combo.items.forEach(itemId => {
                          const menuItem = menuItems.find(m => m.id === itemId);
                          if (menuItem) {
                            addItem({
                              id: menuItem.id || '',
                              name: menuItem.name,
                              price: menuItem.price,
                              image: menuItem.image
                            });
                          }
                        });
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                      Add Combo
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Menu Items</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <MenuItemSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or category filter</p>
                </div>
              ) : (
                filteredMenuItems.map((item, index) => (
                  <motion.div
              key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                      className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x200?text=Food';
                }}
              />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <span className="text-primary-600 font-bold text-xl">₹{item.price}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{item.description}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({item.totalReviews} reviews)</span>
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          item.stockQuantity > 20 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          item.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {item.stockQuantity > 20 ? 'In Stock' :
                           item.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                        <div className="flex items-center space-x-2">
                          {item.customizationOptions && (
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowCustomization(true);
                              }}
                              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                              title="Customize"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowReviews(true);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Reviews"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stockQuantity === 0}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {item.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCustomization(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customize {selectedItem.name}</h2>
            
            <div className="space-y-4">
              {selectedItem.customizationOptions?.spiceLevel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                  <select
                    value={customization.spiceLevel || ''}
                    onChange={(e) => setCustomization({ ...customization, spiceLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select spice level</option>
                    {selectedItem.customizationOptions.spiceLevel.map((level: string) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedItem.customizationOptions?.sugarLevel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level</label>
                  <select
                    value={customization.sugarLevel || ''}
                    onChange={(e) => setCustomization({ ...customization, sugarLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select sugar level</option>
                    {selectedItem.customizationOptions.sugarLevel.map((level: string) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedItem.customizationOptions?.portionSize && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portion Size</label>
                  <select
                    value={customization.portionSize || ''}
                    onChange={(e) => setCustomization({ ...customization, portionSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select portion size</option>
                    {selectedItem.customizationOptions.portionSize.map((size: string) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedItem.customizationOptions?.extras && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                  <div className="space-y-2">
                    {selectedItem.customizationOptions.extras.map((extra: string) => (
                      <label key={extra} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customization.extras?.includes(extra) || false}
                          onChange={(e) => {
                            const currentExtras = customization.extras || [];
                            if (e.target.checked) {
                              setCustomization({ ...customization, extras: [...currentExtras, extra] });
                            } else {
                              setCustomization({ ...customization, extras: currentExtras.filter((e: string) => e !== extra) });
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{extra}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                onClick={handleCustomizedAdd}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setShowCustomization(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reviews Modal */}
      {showReviews && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowReviews(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews for {selectedItem.name}</h2>
            
            {/* Add Review */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Add Your Review</h3>
              <div className="flex items-center space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Write your review..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleAddReview}
                className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Submit Review
              </button>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-4">
              {selectedItem.reviews?.map((review: any) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{review.userName}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
          ))}
        </div>
      </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-500 text-xs mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onVoiceSearch={() => setIsListening(true)}
        onShowRecommendations={() => setShowAIRecommendations(!showAIRecommendations)}
        onShowFavorites={() => {
          addToast({
            type: 'info',
            title: 'Favorites',
            message: 'Favorites feature coming soon!'
          });
        }}
      />
    </div>
  );
};

export default StudentMenuPage; 