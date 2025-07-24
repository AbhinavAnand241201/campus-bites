import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Apple, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  
  const { login, loginWithGoogle, loginWithApple, resetPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully logged in to your account.'
      });
      navigate('/menu');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Failed to login. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
      addToast({
        type: 'success',
        title: 'Welcome!',
        message: 'Successfully logged in with Google.'
      });
      navigate('/menu');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Google Login Failed',
        message: error.message || 'Failed to login with Google.'
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoadingApple(true);
    try {
      await loginWithApple();
      addToast({
        type: 'success',
        title: 'Welcome!',
        message: 'Successfully logged in with Apple.'
      });
      navigate('/menu');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Apple Login Failed',
        message: error.message || 'Failed to login with Apple.'
      });
    } finally {
      setIsLoadingApple(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      addToast({
        type: 'error',
        title: 'Email Required',
        message: 'Please enter your email address first.'
      });
      return;
    }

    try {
      await resetPassword(email);
      addToast({
        type: 'success',
        title: 'Password Reset Email Sent',
        message: 'Check your email for password reset instructions.'
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Password Reset Failed',
        message: error.message || 'Failed to send password reset email.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400"
            >
              Sign in to your Campus Bites account
            </motion.p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              <span>{isLoadingGoogle ? 'Signing in...' : 'Continue with Google'}</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleAppleLogin}
              disabled={isLoadingApple}
              className="w-full flex items-center justify-center space-x-3 bg-black dark:bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Apple className="w-5 h-5" />
              <span>{isLoadingApple ? 'Signing in...' : 'Continue with Apple'}</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
            </div>
        </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
            </label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </button>
          </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
                Sign up
            </Link>
          </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 