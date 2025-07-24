import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dummy user data for demo
const dummyUser = {
  uid: 'demo-user-123',
  email: 'demo@campusbites.com',
  name: 'Demo User',
  phone: '+91 98765 43210',
  role: 'student' as const,
  walletBalance: 1500,
  createdAt: new Date(),
  isEmailVerified: true
};

interface UserData {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: 'student' | 'admin';
  walletBalance: number;
  createdAt: Date;
  isEmailVerified: boolean;
}

interface AuthContextType {
  currentUser: UserData | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  updateWalletBalance: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentUser(dummyUser);
      setUserData(dummyUser);
      setLoading(false);
    }, 1000); // 1 second delay to simulate loading

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@campusbites.com' && password === 'demo123') {
      setCurrentUser(dummyUser);
      setUserData(dummyUser);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error('Invalid credentials. Use demo@campusbites.com / demo123');
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser(dummyUser);
    setUserData(dummyUser);
    setLoading(false);
  };

  const loginWithApple = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser(dummyUser);
    setUserData(dummyUser);
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'admin') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...dummyUser,
      email,
      name,
      role,
      uid: `user-${Date.now()}`
    };
    
    setCurrentUser(newUser);
    setUserData(newUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    setUserData(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // In demo, just show success
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!userData) return;
    
    const updatedUser = { ...userData, ...data };
    setUserData(updatedUser);
    setCurrentUser(updatedUser);
  };

  const updateWalletBalance = async (amount: number) => {
    if (!userData) return;
    
    const updatedUser = { ...userData, walletBalance: amount };
    setUserData(updatedUser);
    setCurrentUser(updatedUser);
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    loginWithGoogle,
    loginWithApple,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    updateWalletBalance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth }; 