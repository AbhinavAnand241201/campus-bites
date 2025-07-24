import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ordersService, Order } from '../firebase/services';
import { useToast } from './ToastContext';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'CLEAR_ORDERS' };

interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: Omit<Order, 'id'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  loadUserOrders: () => Promise<void>;
  loadAllOrders: () => Promise<void>;
  clearOrders: () => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false, error: null };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        loading: false,
        error: null
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        loading: false,
        error: null
      };
    
    case 'CLEAR_ORDERS':
      return { ...state, orders: [], loading: false, error: null };
    
    default:
      return state;
  }
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
    loading: false,
    error: null
  });

  const { currentUser, userData } = useAuth();
  const { addToast } = useToast();

  // Load user orders when user logs in
  useEffect(() => {
    if (currentUser && userData?.role === 'student') {
      loadUserOrders();
    } else if (currentUser && userData?.role === 'admin') {
      loadAllOrders();
    }
  }, [currentUser, userData?.role]);

  const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const orderId = await ordersService.create(orderData);
      
      // Add the new order to the state
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      
      addToast({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Your order #${orderId.slice(-6)} has been placed and is being prepared.`
      });
      
      return orderId;
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

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await ordersService.updateStatus(orderId, status);
      
      // Update the order in the state
      const updatedOrder = state.orders.find(order => order.id === orderId);
      if (updatedOrder) {
        const newOrder = { ...updatedOrder, status, updatedAt: new Date() };
        dispatch({ type: 'UPDATE_ORDER', payload: newOrder });
      }
      
      addToast({
        type: 'success',
        title: 'Order Updated',
        message: `Order status updated to ${status}.`
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update order status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
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
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const orders = await ordersService.getByUserId(currentUser.uid);
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
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
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

  const getOrderById = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  const getUserOrders = async (): Promise<void> => {
    return loadUserOrders();
  };

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

export { useOrder }; 