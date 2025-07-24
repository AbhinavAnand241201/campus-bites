import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Users,
  Calendar
} from 'lucide-react';
import { menuItems } from '../../lib/sampleData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  items: number;
}

const InventoryManagementPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [inventoryStats, setInventoryStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    monthlyRevenue: 0,
    monthlyCost: 0,
    monthlyProfit: 0
  });

  // Mock sales data for the last 30 days
  const salesData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    revenue: Math.floor(Math.random() * 5000) + 2000,
    orders: Math.floor(Math.random() * 50) + 20,
    items: Math.floor(Math.random() * 100) + 50
  }));

  // Calculate inventory statistics
  useEffect(() => {
    const stats = {
      totalItems: menuItems.length,
      lowStockItems: menuItems.filter(item => item.stockQuantity < 20).length,
      outOfStockItems: menuItems.filter(item => item.stockQuantity === 0).length,
      totalValue: menuItems.reduce((sum, item) => sum + (item.stockQuantity * item.costPrice), 0),
      monthlyRevenue: menuItems.reduce((sum, item) => sum + (item.salesCount * item.price), 0),
      monthlyCost: menuItems.reduce((sum, item) => sum + (item.salesCount * item.costPrice), 0),
      monthlyProfit: 0
    };
    stats.monthlyProfit = stats.monthlyRevenue - stats.monthlyCost;
    setInventoryStats(stats);
  }, []);

  // Best and low selling products
  const bestSellingProducts = [...menuItems]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  const lowSellingProducts = [...menuItems]
    .sort((a, b) => a.salesCount - b.salesCount)
    .slice(0, 5);

  // Category-wise sales data
  const categoryData = menuItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = { name: category, sales: 0, revenue: 0 };
    }
    acc[category].sales += item.salesCount;
    acc[category].revenue += item.salesCount * item.price;
    return acc;
  }, {} as Record<string, { name: string; sales: number; revenue: number }>);

  const categoryChartData = Object.values(categoryData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Track inventory, sales, and financial performance</p>
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
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{inventoryStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 ml-1">+12% from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{inventoryStats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 ml-1">+8% from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Monthly Profit</p>
              <p className="text-2xl font-bold text-gray-900">₹{inventoryStats.monthlyProfit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 ml-1">+15% from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm text-yellow-600">Needs attention</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Best Selling Products</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {bestSellingProducts.map((product, index) => (
              <div key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.salesCount} sold</p>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Low Selling Products</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {lowSellingProducts.map((product, index) => (
              <div key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.salesCount} sold</p>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Inventory Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {menuItems.filter(item => item.stockQuantity < 20).map(item => (
            <div key={item.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Current stock: {item.stockQuantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.stockQuantity === 0 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryManagementPage; 