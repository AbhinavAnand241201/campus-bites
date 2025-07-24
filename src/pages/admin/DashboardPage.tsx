import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  DollarSign,
  Users,
  Package,
  Wallet,
  MenuIcon,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { state: orderState } = useOrder();
  const { userData } = useAuth();

  // Calculate real stats from order data
  const today = new Date().toDateString();
  const todayOrders = orderState.orders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  
  const totalRevenue = orderState.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = orderState.orders.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  ).length;
  const stats = [
    {
      name: 'Today\'s Revenue',
      value: `₹${todayRevenue}`,
      change: todayOrders.length > 0 ? '+12%' : '0%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      name: 'Total Orders Today',
      value: todayOrders.length.toString(),
      change: todayOrders.length > 0 ? '+8%' : '0%',
      changeType: 'positive',
      icon: ShoppingCart
    },
    {
      name: 'Active Orders',
      value: activeOrders.toString(),
      change: activeOrders > 0 ? '-3%' : '0%',
      changeType: activeOrders > 0 ? 'negative' : 'positive',
      icon: Clock
    },
    {
      name: 'Total Revenue',
      value: `₹${totalRevenue}`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ];

  const recentOrders = orderState.orders
    .slice(0, 5)
    .map(order => ({
      id: order.orderNumber,
      student: order.userName,
      items: order.items.map((item: any) => item.name),
      total: order.totalAmount,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      time: new Date(order.createdAt).toLocaleTimeString()
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.student}</p>
                    <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.total}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Ready for Pickup' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Preparing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{order.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Manage Wallets</h3>
              <p className="text-primary-100 text-sm">Add credit to student accounts</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <MenuIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Menu Management</h3>
              <p className="text-blue-100 text-sm">Update menu items and availability</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">View Orders</h3>
              <p className="text-green-100 text-sm">Monitor and update order status</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage; 