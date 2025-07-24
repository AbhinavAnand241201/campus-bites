import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Wallet, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const { state, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'navbar-blur' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Campus Bites</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
                          {currentUser ? (
              <>
                <Link
                  to="/menu"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Menu
                </Link>
                <Link
                  to="/my-orders"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Profile
                </Link>
                {userData?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg">
                    <Wallet className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                      ₹{userData?.walletBalance || 0}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>My Cart ({state.itemCount})</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/menu"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Menu
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>My Cart ({state.itemCount})</span>
                  </Link>
                  {userData?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-primary-700">
                        ₹{userData?.walletBalance || 0}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 font-medium flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-primary-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar; 