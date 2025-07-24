import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { menuItems as sampleMenuItems } from '../../lib/sampleData';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true
  });

  const categories = ['all', 'main', 'sides', 'drinks', 'desserts'];

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const menuRef = collection(db, 'menuItems');
        const querySnapshot = await getDocs(menuRef);
        
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        
        setMenuItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMessage({ type: 'error', text: 'Failed to fetch menu items' });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, menuItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Food+Image',
        isAvailable: formData.isAvailable,
        createdAt: serverTimestamp()
      };

      if (editingItem) {
        // Update existing item
        const itemRef = doc(db, 'menuItems', editingItem.id);
        await updateDoc(itemRef, itemData);
        
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...itemData } : item
        ));
        
        setMessage({ type: 'success', text: 'Menu item updated successfully' });
      } else {
        // Add new item
        const docRef = await addDoc(collection(db, 'menuItems'), itemData);
        const newItem = { id: docRef.id, ...itemData };
        setMenuItems(prev => [...prev, newItem]);
        setMessage({ type: 'success', text: 'Menu item added successfully' });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setMessage({ type: 'error', text: 'Failed to save menu item' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      setMessage({ type: 'success', text: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setMessage({ type: 'error', text: 'Failed to delete menu item' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    });
    setShowForm(true);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const itemRef = doc(db, 'menuItems', item.id);
      await updateDoc(itemRef, { isAvailable: !item.isAvailable });
      
      setMenuItems(prev => prev.map(menuItem => 
        menuItem.id === item.id 
          ? { ...menuItem, isAvailable: !menuItem.isAvailable }
          : menuItem
      ));
      
      setMessage({ 
        type: 'success', 
        text: `${item.name} is now ${!item.isAvailable ? 'available' : 'unavailable'}` 
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
      setMessage({ type: 'error', text: 'Failed to update availability' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const populateSampleData = async () => {
    if (!confirm('This will add sample menu items. Continue?')) return;
    
    setLoading(true);
    try {
      for (const item of sampleMenuItems) {
        await addDoc(collection(db, 'menuItems'), {
          ...item,
          imageUrl: item.image,
          isAvailable: item.available,
          createdAt: serverTimestamp()
        });
      }
      
      // Refresh the menu items
      const menuRef = collection(db, 'menuItems');
      const querySnapshot = await getDocs(menuRef);
      
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      
      setMenuItems(items);
      setFilteredItems(items);
      setMessage({ type: 'success', text: 'Sample menu items added successfully!' });
    } catch (error) {
      console.error('Error populating sample data:', error);
      setMessage({ type: 'error', text: 'Failed to add sample data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage your menu items and availability</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={populateSampleData}
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Sample Data</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      {loading && menuItems.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading menu items...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`p-2 rounded-full ${
                        item.isAvailable 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="font-bold text-primary-600">${item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Form Modal */}
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
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select category</option>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                    Available for ordering
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      editingItem ? 'Update Item' : 'Add Item'
                    )}
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

export default MenuManagementPage; 