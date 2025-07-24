import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ordersService } from '../firebase/services';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  userName: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    customization?: any;
  }>;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'wallet' | 'cash' | 'card';
  pickupTime: Date;
  createdAt: Date;
  qrCode?: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; status: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ORDERS' };

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false, error: null };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status as Order['status'] }
            : order
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ORDERS':
      return { ...state, orders: [] };
    default:
      return state;
  }
};

interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: Omit<Order, 'id'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  loadUserOrders: () => Promise<void>;
  loadAllOrders: () => Promise<void>;
  clearOrders: () => void;
  getOrderById: (id: string) => Promise<Order | null>;
  getUserOrders: (userId: string) => Promise<Order[]>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
    loading: false,
    error: null
  });

  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newOrder = await ordersService.create(orderData);
      
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      
      addToast({
        type: 'success',
        title: 'Order Created',
        message: 'Your order has been placed successfully!'
      });
      
      return newOrder;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: errorMessage
      });
      
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    try {
      await ordersService.updateStatus(id, status);
      dispatch({ type: 'UPDATE_ORDER', payload: { id, status } });
      
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order status updated to ${status}`
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update order status';
      
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: errorMessage
      });
      
      throw error;
    }
  };

  const loadUserOrders = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const orders = await ordersService.getUserOrders(currentUser.uid);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load orders';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: errorMessage
      });
    }
  };

  const loadAllOrders = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const orders = await ordersService.getAll();
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load orders';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: errorMessage
      });
    }
  };

  const clearOrders = (): void => {
    dispatch({ type: 'CLEAR_ORDERS' });
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      return await ordersService.getById(id);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get order';
      
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: errorMessage
      });
      
      return null;
    }
  };

  const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
      return await ordersService.getUserOrders(userId);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get user orders';
      
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: errorMessage
      });
      
      return [];
    }
  };

  // Load user orders when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserOrders();
    }
  }, [currentUser]);

  const value: OrderContextType = {
    state,
    createOrder,
    updateOrderStatus,
    loadUserOrders,
    loadAllOrders,
    clearOrders,
    getOrderById,
    getUserOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export { OrderProvider, useOrder }; 