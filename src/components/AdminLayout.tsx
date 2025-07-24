import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Menu as MenuIcon,
  Wallet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Package,
  CreditCard,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { logout, userData } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Inventory Management',
      href: '/admin/inventory',
      icon: Package,
      current: location.pathname === '/admin/inventory'
    },
    {
      name: 'Menu Management',
      href: '/admin/menu',
      icon: MenuIcon,
      current: location.pathname === '/admin/menu'
    },
    {
      name: 'Combo Offers',
      href: '/admin/combos',
      icon: BarChart3,
      current: location.pathname === '/admin/combos'
    },
    {
      name: 'Staff Attendance',
      href: '/admin/staff',
      icon: Calendar,
      current: location.pathname === '/admin/staff'
    },
    {
      name: 'Credit Sales',
      href: '/admin/credit',
      icon: CreditCard,
      current: location.pathname === '/admin/credit'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: location.pathname === '/admin/orders'
    },
    {
      name: 'Manage Wallets',
      href: '/admin/wallets',
      icon: Wallet,
      current: location.pathname === '/admin/wallets'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarCollapsed ? '-translate-x-48' : 'translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              {!sidebarCollapsed && (
                <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 