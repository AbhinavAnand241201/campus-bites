export const canteenName = "Underground Canteen";

// High-quality, relevant images for each menu item
const images = {
  butterChicken: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80",
  paneerTikka: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  biryani: "https://images.unsplash.com/photo-1563379091339-03246963d4a9?auto=format&fit=crop&w=400&q=80",
  masalaDosa: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
  coldCoffee: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80",
  chai: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
  samosa: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",
  iceCream: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
  chocolateCake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=400&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
  rice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80",
  dal: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  roti: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
};

export const menuItems = [
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    price: 180,
    image: images.butterChicken,
    description: 'Creamy, rich curry with tender chicken pieces in a tomato-based sauce',
    category: 'Main Course',
    available: true,
    preparationTime: 15,
    // New USP features
    stockQuantity: 50,
    costPrice: 120,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      portionSize: ['Regular', 'Large'],
      extras: ['Extra Rice', 'Extra Gravy', 'Extra Chicken']
    },
    reviews: [
      { id: 1, rating: 4.5, comment: 'Amazing taste! Perfect spice level.', userName: 'Rahul K.', date: '2024-01-15' },
      { id: 2, rating: 4.0, comment: 'Good but could be spicier', userName: 'Priya S.', date: '2024-01-14' }
    ],
    averageRating: 4.25,
    totalReviews: 2,
    salesCount: 45
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    price: 160,
    image: images.paneerTikka,
    description: 'Grilled cottage cheese marinated in aromatic spices and yogurt',
    category: 'Appetizer',
    available: true,
    preparationTime: 12,
    stockQuantity: 30,
    costPrice: 100,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      portionSize: ['Regular', 'Large'],
      extras: ['Extra Chutney', 'Extra Onions']
    },
    reviews: [
      { id: 3, rating: 4.8, comment: 'Best paneer tikka ever!', userName: 'Amit P.', date: '2024-01-16' }
    ],
    averageRating: 4.8,
    totalReviews: 1,
    salesCount: 28
  },
  {
    id: 'biryani',
    name: 'Biryani',
    price: 220,
    image: images.biryani,
    description: 'Fragrant rice dish with tender meat and aromatic spices',
    category: 'Main Course',
    available: true,
    preparationTime: 20,
    stockQuantity: 25,
    costPrice: 150,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      portionSize: ['Half', 'Full'],
      extras: ['Extra Raita', 'Extra Pickle', 'Extra Meat']
    },
    reviews: [
      { id: 4, rating: 4.2, comment: 'Authentic taste!', userName: 'Sneha M.', date: '2024-01-13' },
      { id: 5, rating: 4.6, comment: 'Perfect biryani!', userName: 'Vikram R.', date: '2024-01-12' }
    ],
    averageRating: 4.4,
    totalReviews: 2,
    salesCount: 35
  },
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    price: 120,
    image: images.masalaDosa,
    description: 'Crispy rice crepe filled with spiced potato mixture',
    category: 'Breakfast',
    available: true,
    preparationTime: 10,
    stockQuantity: 40,
    costPrice: 80,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium'],
      portionSize: ['Regular', 'Large'],
      extras: ['Extra Chutney', 'Extra Sambar', 'Extra Potato']
    },
    reviews: [
      { id: 6, rating: 4.0, comment: 'Good breakfast option', userName: 'Kavya L.', date: '2024-01-15' }
    ],
    averageRating: 4.0,
    totalReviews: 1,
    salesCount: 32
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    price: 80,
    image: images.coldCoffee,
    description: 'Rich and creamy cold coffee with ice cream',
    category: 'Beverages',
    available: true,
    preparationTime: 5,
    stockQuantity: 60,
    costPrice: 50,
    customizationOptions: {
      sugarLevel: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sweet'],
      milkType: ['Regular Milk', 'Almond Milk', 'Soy Milk'],
      extras: ['Extra Ice Cream', 'Extra Coffee Shot', 'Whipped Cream']
    },
    reviews: [
      { id: 7, rating: 4.3, comment: 'Perfect sweetness!', userName: 'Arjun S.', date: '2024-01-16' },
      { id: 8, rating: 4.7, comment: 'Best cold coffee on campus!', userName: 'Meera K.', date: '2024-01-14' }
    ],
    averageRating: 4.5,
    totalReviews: 2,
    salesCount: 55
  },
  {
    id: 'chai',
    name: 'Masala Chai',
    price: 25,
    image: images.chai,
    description: 'Traditional Indian spiced tea with milk and aromatic spices',
    category: 'Beverages',
    available: true,
    preparationTime: 3,
    stockQuantity: 100,
    costPrice: 15,
    customizationOptions: {
      sugarLevel: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sweet'],
      milkType: ['Regular Milk', 'Almond Milk', 'Soy Milk'],
      extras: ['Extra Ginger', 'Extra Cardamom', 'Extra Masala']
    },
    reviews: [
      { id: 9, rating: 4.8, comment: 'Perfect masala chai!', userName: 'Neha R.', date: '2024-01-16' },
      { id: 10, rating: 4.6, comment: 'Authentic taste!', userName: 'Ravi K.', date: '2024-01-15' }
    ],
    averageRating: 4.7,
    totalReviews: 2,
    salesCount: 120
  },
  {
    id: 'samosa',
    name: 'Vegetable Samosa',
    price: 30,
    image: images.samosa,
    description: 'Crispy pastry filled with spiced potatoes and peas',
    category: 'Snacks',
    available: true,
    preparationTime: 8,
    stockQuantity: 80,
    costPrice: 20,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      extras: ['Extra Chutney', 'Extra Onions', 'Extra Mint']
    },
    reviews: [
      { id: 11, rating: 4.4, comment: 'Crispy and delicious!', userName: 'Anjali M.', date: '2024-01-16' }
    ],
    averageRating: 4.4,
    totalReviews: 1,
    salesCount: 75
  },
  {
    id: 'pizza',
    name: 'Margherita Pizza',
    price: 200,
    image: images.pizza,
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    category: 'Fast Food',
    available: true,
    preparationTime: 15,
    stockQuantity: 20,
    costPrice: 120,
    customizationOptions: {
      size: ['Small', 'Medium', 'Large'],
      extras: ['Extra Cheese', 'Extra Toppings', 'Extra Sauce']
    },
    reviews: [
      { id: 12, rating: 4.2, comment: 'Good pizza!', userName: 'Aditya S.', date: '2024-01-14' }
    ],
    averageRating: 4.2,
    totalReviews: 1,
    salesCount: 18
  },
  {
    id: 'burger',
    name: 'Chicken Burger',
    price: 150,
    image: images.burger,
    description: 'Juicy chicken patty with fresh vegetables and special sauce',
    category: 'Fast Food',
    available: true,
    preparationTime: 10,
    stockQuantity: 35,
    costPrice: 90,
    customizationOptions: {
      extras: ['Extra Cheese', 'Extra Sauce', 'Extra Vegetables', 'Extra Patty']
    },
    reviews: [
      { id: 13, rating: 4.3, comment: 'Delicious burger!', userName: 'Karan P.', date: '2024-01-16' }
    ],
    averageRating: 4.3,
    totalReviews: 1,
    salesCount: 30
  },
  {
    id: 'fries',
    name: 'French Fries',
    price: 80,
    image: images.fries,
    description: 'Crispy golden fries served with ketchup',
    category: 'Snacks',
    available: true,
    preparationTime: 8,
    stockQuantity: 50,
    costPrice: 40,
    customizationOptions: {
      size: ['Small', 'Medium', 'Large'],
      extras: ['Extra Ketchup', 'Extra Mayo', 'Cheese Sauce']
    },
    reviews: [
      { id: 14, rating: 4.1, comment: 'Crispy and hot!', userName: 'Sanya L.', date: '2024-01-15' }
    ],
    averageRating: 4.1,
    totalReviews: 1,
    salesCount: 45
  },
  {
    id: 'ice-cream',
    name: 'Vanilla Ice Cream',
    price: 60,
    image: images.iceCream,
    description: 'Creamy vanilla ice cream with chocolate sauce',
    category: 'Desserts',
    available: true,
    preparationTime: 2,
    stockQuantity: 40,
    costPrice: 35,
    customizationOptions: {
      toppings: ['Chocolate Sauce', 'Strawberry Sauce', 'Nuts', 'Sprinkles'],
      extras: ['Extra Scoop', 'Extra Sauce']
    },
    reviews: [
      { id: 15, rating: 4.6, comment: 'Perfect dessert!', userName: 'Ishita K.', date: '2024-01-16' }
    ],
    averageRating: 4.6,
    totalReviews: 1,
    salesCount: 38
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    price: 120,
    image: images.chocolateCake,
    description: 'Rich chocolate cake with chocolate frosting',
    category: 'Desserts',
    available: true,
    preparationTime: 5,
    stockQuantity: 15,
    costPrice: 70,
    customizationOptions: {
      extras: ['Extra Frosting', 'Extra Chocolate', 'Whipped Cream']
    },
    reviews: [
      { id: 16, rating: 4.7, comment: 'Amazing chocolate cake!', userName: 'Riya S.', date: '2024-01-15' }
    ],
    averageRating: 4.7,
    totalReviews: 1,
    salesCount: 12
  },
  {
    id: 'pasta',
    name: 'Pasta Alfredo',
    price: 180,
    image: images.pasta,
    description: 'Creamy pasta with parmesan cheese and garlic',
    category: 'Main Course',
    available: true,
    preparationTime: 12,
    stockQuantity: 25,
    costPrice: 110,
    customizationOptions: {
      extras: ['Extra Cheese', 'Extra Cream', 'Extra Garlic', 'Chicken']
    },
    reviews: [
      { id: 17, rating: 4.4, comment: 'Creamy and delicious!', userName: 'Vedant M.', date: '2024-01-14' }
    ],
    averageRating: 4.4,
    totalReviews: 1,
    salesCount: 22
  },
  {
    id: 'noodles',
    name: 'Chow Mein',
    price: 140,
    image: images.noodles,
    description: 'Stir-fried noodles with vegetables and soy sauce',
    category: 'Main Course',
    available: true,
    preparationTime: 10,
    stockQuantity: 30,
    costPrice: 85,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      extras: ['Extra Vegetables', 'Extra Noodles', 'Chicken', 'Egg']
    },
    reviews: [
      { id: 18, rating: 4.3, comment: 'Authentic Chinese taste!', userName: 'Arnav K.', date: '2024-01-16' }
    ],
    averageRating: 4.3,
    totalReviews: 1,
    salesCount: 28
  },
  {
    id: 'sandwich',
    name: 'Club Sandwich',
    price: 100,
    image: images.sandwich,
    description: 'Triple-decker sandwich with chicken, lettuce, and tomato',
    category: 'Fast Food',
    available: true,
    preparationTime: 8,
    stockQuantity: 40,
    costPrice: 60,
    customizationOptions: {
      extras: ['Extra Chicken', 'Extra Cheese', 'Extra Vegetables', 'Extra Mayo']
    },
    reviews: [
      { id: 19, rating: 4.2, comment: 'Fresh and filling!', userName: 'Tanvi P.', date: '2024-01-15' }
    ],
    averageRating: 4.2,
    totalReviews: 1,
    salesCount: 35
  },
  {
    id: 'salad',
    name: 'Caesar Salad',
    price: 90,
    image: images.salad,
    description: 'Fresh lettuce with croutons, parmesan, and caesar dressing',
    category: 'Healthy',
    available: true,
    preparationTime: 6,
    stockQuantity: 35,
    costPrice: 55,
    customizationOptions: {
      extras: ['Extra Chicken', 'Extra Cheese', 'Extra Croutons', 'Extra Dressing']
    },
    reviews: [
      { id: 20, rating: 4.5, comment: 'Fresh and healthy!', userName: 'Zara A.', date: '2024-01-16' }
    ],
    averageRating: 4.5,
    totalReviews: 1,
    salesCount: 32
  },
  {
    id: 'soup',
    name: 'Tomato Soup',
    price: 70,
    image: images.soup,
    description: 'Creamy tomato soup with herbs and croutons',
    category: 'Appetizer',
    available: true,
    preparationTime: 5,
    stockQuantity: 45,
    costPrice: 40,
    customizationOptions: {
      extras: ['Extra Croutons', 'Extra Cream', 'Extra Herbs']
    },
    reviews: [
      { id: 21, rating: 4.3, comment: 'Warm and comforting!', userName: 'Aisha R.', date: '2024-01-15' }
    ],
    averageRating: 4.3,
    totalReviews: 1,
    salesCount: 40
  },
  {
    id: 'rice',
    name: 'Steamed Rice',
    price: 50,
    image: images.rice,
    description: 'Perfectly cooked basmati rice',
    category: 'Sides',
    available: true,
    preparationTime: 15,
    stockQuantity: 60,
    costPrice: 25,
    customizationOptions: {
      extras: ['Extra Rice', 'Ghee Rice', 'Jeera Rice']
    },
    reviews: [
      { id: 22, rating: 4.0, comment: 'Perfect with curry!', userName: 'Dhruv S.', date: '2024-01-14' }
    ],
    averageRating: 4.0,
    totalReviews: 1,
    salesCount: 55
  },
  {
    id: 'dal',
    name: 'Dal Fry',
    price: 60,
    image: images.dal,
    description: 'Spiced lentils with onions and tomatoes',
    category: 'Main Course',
    available: true,
    preparationTime: 12,
    stockQuantity: 50,
    costPrice: 35,
    customizationOptions: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      extras: ['Extra Dal', 'Extra Tadka', 'Extra Ghee']
    },
    reviews: [
      { id: 23, rating: 4.4, comment: 'Homely taste!', userName: 'Kavya M.', date: '2024-01-16' }
    ],
    averageRating: 4.4,
    totalReviews: 1,
    salesCount: 48
  },
  {
    id: 'roti',
    name: 'Butter Roti',
    price: 20,
    image: images.roti,
    description: 'Soft whole wheat bread with butter',
    category: 'Sides',
    available: true,
    preparationTime: 5,
    stockQuantity: 80,
    costPrice: 12,
    customizationOptions: {
      extras: ['Extra Butter', 'Extra Roti', 'Ghee Roti']
    },
    reviews: [
      { id: 24, rating: 4.1, comment: 'Soft and fresh!', userName: 'Rohan K.', date: '2024-01-15' }
    ],
    averageRating: 4.1,
    totalReviews: 1,
    salesCount: 75
  }
];

// Combo offers for low sales or special days
export const comboOffers = [
  {
    id: 'combo-1',
    name: 'Weekend Special Combo',
    description: 'Perfect for Saturday hangouts',
    items: [
      { id: 'butter-chicken', quantity: 1 },
      { id: 'cold-coffee', quantity: 1 }
    ],
    originalPrice: 260,
    discountedPrice: 200,
    validDays: ['Saturday', 'Sunday'],
    validUntil: '2024-12-31',
    isActive: true
  },
  {
    id: 'combo-2',
    name: 'Student Budget Combo',
    description: 'Great value for money',
    items: [
      { id: 'masala-dosa', quantity: 1 },
      { id: 'cold-coffee', quantity: 1 }
    ],
    originalPrice: 200,
    discountedPrice: 150,
    validDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    validUntil: '2024-12-31',
    isActive: true
  }
];

// Staff attendance data
export const staffMembers = [
  {
    id: 'staff-1',
    name: 'Rajesh Kumar',
    role: 'Chef',
    hourlyRate: 150,
    attendance: [
      { date: '2024-01-15', checkIn: '08:00', checkOut: '16:00', hours: 8 },
      { date: '2024-01-16', checkIn: '08:15', checkOut: '16:30', hours: 8.25 }
    ]
  },
  {
    id: 'staff-2',
    name: 'Priya Sharma',
    role: 'Cashier',
    hourlyRate: 120,
    attendance: [
      { date: '2024-01-15', checkIn: '09:00', checkOut: '17:00', hours: 8 },
      { date: '2024-01-16', checkIn: '08:45', checkOut: '17:15', hours: 8.5 }
    ]
  }
];

// Credit sales management
export const creditAccounts = [
  {
    id: 'credit-1',
    studentId: 'student-123',
    studentName: 'Test Student',
    email: 'student@test.com',
    creditLimit: 500,
    currentBalance: 200,
    transactions: [
      { date: '2024-01-15', amount: 180, type: 'purchase', description: 'Butter Chicken + Cold Coffee' },
      { date: '2024-01-16', amount: 100, type: 'payment', description: 'Payment received' }
    ]
  }
];

// Group order bonuses
export const groupOrderBonuses = [
  {
    id: 'bonus-1',
    name: 'Group Order Bonus',
    description: 'Get 50 credits when group order exceeds ₹1000',
    minimumAmount: 1000,
    bonusCredits: 50,
    isActive: true
  }
]; 