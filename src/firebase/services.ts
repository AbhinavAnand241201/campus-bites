import { menuItems, comboOffers, staffMembers, creditAccounts, groupOrderBonuses } from '../lib/sampleData';

// Mock data for demo - bypasses Firebase completely
export const menuItemsService = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return menuItems;
  },
  
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return menuItems.find(item => item.id === id);
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Created menu item:', data);
    return { id: `item-${Date.now()}`, ...data };
  },
  
  update: async (id: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated menu item:', id, data);
    return { id, ...data };
  },
  
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleted menu item:', id);
    return true;
  }
};

export const ordersService = {
  create: async (orderData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: `CB${Date.now()}`,
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    };
    console.log('Created order:', order);
    return order;
  },
  
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock orders
    return [
      {
        id: 'order-1',
        orderNumber: 'CB001',
        userId: 'demo-user-123',
        userName: 'Demo User',
        items: [
          { id: '1', name: 'Butter Chicken', price: 250, quantity: 2, customization: { spiceLevel: 'medium' } }
        ],
        totalAmount: 500,
        status: 'completed' as const,
        paymentMethod: 'wallet' as const,
        pickupTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        qrCode: 'demo-qr-code-1'
      },
      {
        id: 'order-2',
        orderNumber: 'CB002',
        userId: 'demo-user-123',
        userName: 'Demo User',
        items: [
          { id: '2', name: 'Paneer Tikka', price: 200, quantity: 1, customization: { spiceLevel: 'mild' } }
        ],
        totalAmount: 200,
        status: 'pending' as const,
        paymentMethod: 'wallet' as const,
        pickupTime: new Date(Date.now() + 45 * 60 * 1000),
        createdAt: new Date(),
        qrCode: 'demo-qr-code-2'
      }
    ];
  },
  
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const orders = await ordersService.getAll();
    return orders.find(order => order.id === id);
  },
  
  getUserOrders: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = await ordersService.getAll();
    return orders.filter(order => order.userId === userId);
  },
  
  updateStatus: async (id: string, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated order status:', id, status);
    return { id, status };
  }
};

export const comboOffersService = {
  getActive: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return comboOffers.filter(combo => combo.isActive);
  },
  
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return comboOffers;
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Created combo offer:', data);
    return { id: `combo-${Date.now()}`, ...data };
  },
  
  update: async (id: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated combo offer:', id, data);
    return { id, ...data };
  },
  
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleted combo offer:', id);
    return true;
  }
};

export const staffService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return staffMembers;
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Created staff member:', data);
    return { id: `staff-${Date.now()}`, ...data };
  },
  
  update: async (id: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated staff member:', id, data);
    return { id, ...data };
  },
  
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleted staff member:', id);
    return true;
  }
};

export const creditAccountsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return creditAccounts;
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Created credit account:', data);
    return { id: `credit-${Date.now()}`, ...data };
  },
  
  update: async (id: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated credit account:', id, data);
    return { id, ...data };
  },
  
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleted credit account:', id);
    return true;
  }
};

export const fileUploadService = {
  uploadImage: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return a mock URL
    return `https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=${encodeURIComponent(file.name)}`;
  }
};

export const createRealtimeListener = (collection: string, callback: (data: any[]) => void) => {
  // Mock realtime listener
  const interval = setInterval(async () => {
    switch (collection) {
      case 'menuItems':
        const menuData = await menuItemsService.getAll();
        callback(menuData);
        break;
      case 'orders':
        const orderData = await ordersService.getAll();
        callback(orderData);
        break;
      default:
        callback([]);
    }
  }, 5000); // Update every 5 seconds

  return () => clearInterval(interval);
};

// Interfaces - Updated to match actual data structure
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number;
  stockQuantity: number;
  costPrice: number;
  customizationOptions?: {
    spiceLevel?: string[];
    sugarLevel?: string[];
    portionSize?: string[];
    extras?: string[];
  };
  reviews?: Array<{
    id: number;
    rating: number;
    comment: string;
    userName: string;
    date: string;
  }>;
  averageRating: number;
  totalReviews: number;
  salesCount: number;
}

export interface Order {
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

export interface ComboOffer {
  id: string;
  name: string;
  description: string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
  originalPrice: number;
  discountedPrice: number;
  validDays: string[];
  validUntil: string;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  attendance: Array<{
    date: string;
    checkIn: string;
    checkOut?: string;
    hours: number;
  }>;
}

export interface CreditAccount {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  creditLimit: number;
  currentBalance: number;
  transactions: Array<{
    date: string;
    amount: number;
    type: string;
    description: string;
  }>;
} 