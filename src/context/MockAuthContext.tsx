import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  walletBalance: number;
}

interface MockAuthContextType {
  user: any | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Mock user data for development
const mockUsers: { [key: string]: UserData } = {
  'student@test.com': {
    uid: 'student-123',
    name: 'Test Student',
    email: 'student@test.com',
    role: 'student',
    walletBalance: 500
  },
  'admin@test.com': {
    uid: 'admin-123',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
    walletBalance: 1000
  }
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Load user data from localStorage or use default
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      const userData = savedUsers[parsedUser.email] || mockUsers[parsedUser.email] || null;
      setUserData(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in mock data
      // Check saved users first, then default users
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      const userData = savedUsers[email] || mockUsers[email];
      
      if (userData) {
        const mockUser = {
          uid: userData.uid,
          email: email,
          displayName: userData.name
        };
        
        setUser(mockUser);
        setUserData(userData);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      if (savedUsers[email] || mockUsers[email]) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: UserData = {
        uid: `user-${Date.now()}`,
        name: name,
        email: email,
        role: 'student',
        walletBalance: 0
      };
      
      // Save to localStorage
      savedUsers[email] = newUser;
      localStorage.setItem('mockUsers', JSON.stringify(savedUsers));
      
      const mockUser = {
        uid: newUser.uid,
        email: email,
        displayName: name
      };
      
      setUser(mockUser);
      setUserData(newUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a default Google user
      const googleUser = {
        uid: 'google-user-123',
        email: 'student@test.com',
        displayName: 'Google User'
      };
      
      setUser(googleUser);
      setUserData(mockUsers['student@test.com']);
      localStorage.setItem('mockUser', JSON.stringify(googleUser));
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserData(null);
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: MockAuthContextType = {
    user,
    userData,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}; 