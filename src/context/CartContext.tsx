import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  customization?: any;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'REMOVE_CUSTOMIZATION'; payload: string }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === existingItem.id && 
            JSON.stringify(item.customization) === JSON.stringify(existingItem.customization)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };

    case 'LOAD_CART':
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        items: action.payload,
        total,
        itemCount
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false
  });

  const { currentUser } = useAuth();

  // Load cart from Firebase when user logs in
  useEffect(() => {
    if (currentUser) {
      loadCartFromFirebase();
    } else {
      // Clear cart when user logs out
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [currentUser]);

  // Save cart to Firebase whenever it changes
  useEffect(() => {
    if (currentUser && state.items.length > 0) {
      saveCartToFirebase();
    }
  }, [state.items, currentUser]);

  const loadCartFromFirebase = async () => {
    if (!currentUser) return;

    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.cart && userData.cart.items) {
          dispatch({ type: 'LOAD_CART', payload: userData.cart.items });
        }
      }
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
    }
  };

  const saveCartToFirebase = async () => {
    if (!currentUser) return;

    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        cart: {
          items: state.items,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error saving cart to Firebase:', error);
    }
  };

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.itemCount;
  };

  const getTotalPrice = () => {
    return state.total;
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { useCart }; 