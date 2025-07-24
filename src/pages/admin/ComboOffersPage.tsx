import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { comboOffers, menuItems } from '../../lib/sampleData';

interface ComboOffer {
  id: string;
  name: string;
  description: string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
  originalPrice: number;
  discountedPrice: number;
  validDays: string[];
  validUntil: string;
  isActive: boolean;
  salesCount?: number;
  revenue?: number;
}

const ComboOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<ComboOffer[]>(comboOffers);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ComboOffer | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; quantity: number }>>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    validUntil: '',
    isActive: true
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calculate combo statistics
  const totalOffers = offers.length;
  const activeOffers = offers.filter(offer => offer.isActive).length;
  const totalRevenue = offers.reduce((sum, offer) => sum + (offer.revenue || 0), 0);
  const totalSales = offers.reduce((sum, offer) => sum + (offer.salesCount || 0), 0);

  // Calculate savings for each offer
  const calculateSavings = (original: number, discounted: number) => {
    return ((original - discounted) / original * 100).toFixed(1);
  };

  // Get item details for combo
  const getItemDetails = (itemId: string) => {
    return menuItems.find(item => item.id === itemId);
  };

  // Calculate total original price of combo items
  const calculateOriginalPrice = (items: Array<{ id: string; quantity: number }>) => {
    return items.reduce((total, item) => {
      const menuItem = getItemDetails(item.id);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const originalPrice = calculateOriginalPrice(selectedItems);
    const discountedPrice = parseFloat(formData.discountedPrice);

    const newOffer: ComboOffer = {
      id: editingOffer?.id || `combo-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      items: selectedItems,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      validDays: selectedDays,
      validUntil: formData.validUntil,
      isActive: formData.isActive,
      salesCount: editingOffer?.salesCount || 0,
      revenue: editingOffer?.revenue || 0
    };

    if (editingOffer) {
      setOffers(offers.map(offer => offer.id === editingOffer.id ? newOffer : offer));
    } else {
      setOffers([...offers, newOffer]);
    }

    resetForm();
  };

  const handleEdit = (offer: ComboOffer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      description: offer.description,
      originalPrice: offer.originalPrice.toString(),
      discountedPrice: offer.discountedPrice.toString(),
      validUntil: offer.validUntil,
      isActive: offer.isActive
    });
    setSelectedItems(offer.items);
    setSelectedDays(offer.validDays);
    setShowForm(true);
  };

  const handleDelete = (offerId: string) => {
    if (confirm('Are you sure you want to delete this combo offer?')) {
      setOffers(offers.filter(offer => offer.id !== offerId));
    }
  };

  const handleToggleActive = (offerId: string) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      validUntil: '',
      isActive: true
    });
    setSelectedItems([]);
    setSelectedDays([]);
    setEditingOffer(null);
    setShowForm(false);
  };

  const addItemToCombo = (itemId: string) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { id: itemId, quantity: 1 }]);
    }
  };

  const removeItemFromCombo = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCombo(itemId);
    } else {
      setSelectedItems(selectedItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Combo Offers</h1>
          <p className="text-gray-600 mt-2">Manage combo offers and promotions to boost sales</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Combo</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{totalOffers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-green-600">{activeOffers}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Combo Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(offer.id)}
                      className={`p-1 rounded-full ${
                        offer.isActive 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {offer.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{offer.description}</p>
              </div>

              {/* Items */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {offer.items.map((item) => {
                    const menuItem = getItemDetails(item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {menuItem?.name} x{item.quantity}
                        </span>
                        <span className="text-gray-500">₹{menuItem?.price}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Original Price:</span>
                    <span className="text-sm line-through text-gray-500">₹{offer.originalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Discounted Price:</span>
                    <span className="text-lg font-bold text-green-600">₹{offer.discountedPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">You Save:</span>
                    <span className="text-sm font-medium text-green-600">
                      ₹{offer.originalPrice - offer.discountedPrice} ({calculateSavings(offer.originalPrice, offer.discountedPrice)}%)
                    </span>
                  </div>
                </div>

                {/* Validity */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Valid on:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {offer.validDays.map((day) => (
                      <span
                        key={day}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium text-gray-900">{offer.salesCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-gray-900">₹{(offer.revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create/Edit Combo Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingOffer ? 'Edit Combo Offer' : 'Create New Combo Offer'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Combo Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Select Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Items for Combo
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addItemToCombo(item.id)}
                          className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Items
                    </label>
                    <div className="space-y-2">
                      {selectedItems.map((item) => {
                        const menuItem = getItemDetails(item.id);
                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{menuItem?.name}</p>
                              <p className="text-sm text-gray-600">₹{menuItem?.price} each</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                              />
                              <button
                                type="button"
                                onClick={() => removeItemFromCombo(item.id)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (Auto-calculated)
                    </label>
                    <input
                      type="number"
                      value={calculateOriginalPrice(selectedItems)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Valid Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Days
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedDays.includes(day)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active offer
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingOffer ? 'Update Combo' : 'Create Combo'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComboOffersPage; 