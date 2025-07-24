import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { creditAccounts } from '../../lib/sampleData';

interface CreditAccount {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  creditLimit: number;
  currentBalance: number;
  transactions: Array<{
    date: string;
    amount: number;
    type: 'purchase' | 'payment' | 'credit';
    description: string;
  }>;
}

interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: 'purchase' | 'payment' | 'credit';
  description: string;
  balanceAfter: number;
}

const CreditSalesPage: React.FC = () => {
  const [accounts, setAccounts] = useState<CreditAccount[]>(creditAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState<CreditAccount[]>(creditAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CreditAccount | null>(null);

  // Form states
  const [newAccount, setNewAccount] = useState({
    studentName: '',
    email: '',
    creditLimit: '',
    initialBalance: ''
  });

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'credit',
    description: ''
  });

  // Calculate statistics
  const totalAccounts = accounts.length;
  const totalCreditLimit = accounts.reduce((sum, account) => sum + account.creditLimit, 0);
  const totalOutstanding = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const overdueAccounts = accounts.filter(account => account.currentBalance > account.creditLimit * 0.8).length;

  // Filter accounts
  useEffect(() => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'overdue':
          filtered = filtered.filter(account => account.currentBalance > account.creditLimit * 0.8);
          break;
        case 'active':
          filtered = filtered.filter(account => account.currentBalance > 0 && account.currentBalance <= account.creditLimit * 0.8);
          break;
        case 'paid':
          filtered = filtered.filter(account => account.currentBalance <= 0);
          break;
      }
    }

    setFilteredAccounts(filtered);
  }, [searchTerm, selectedStatus, accounts]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newCreditAccount: CreditAccount = {
      id: `credit-${Date.now()}`,
      studentId: `student-${Date.now()}`,
      studentName: newAccount.studentName,
      email: newAccount.email,
      creditLimit: parseFloat(newAccount.creditLimit),
      currentBalance: parseFloat(newAccount.initialBalance),
      transactions: []
    };

    if (parseFloat(newAccount.initialBalance) > 0) {
      newCreditAccount.transactions.push({
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(newAccount.initialBalance),
        type: 'credit',
        description: 'Initial credit balance'
      });
    }

    setAccounts([...accounts, newCreditAccount]);
    setNewAccount({ studentName: '', email: '', creditLimit: '', initialBalance: '' });
    setShowAddAccount(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    const amount = parseFloat(newTransaction.amount);
    const newBalance = selectedAccount.currentBalance + (newTransaction.type === 'payment' ? -amount : amount);

    const transaction = {
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: newTransaction.type as 'purchase' | 'payment' | 'credit',
      description: newTransaction.description
    };

    const updatedAccount = {
      ...selectedAccount,
      currentBalance: newBalance,
      transactions: [...selectedAccount.transactions, transaction]
    };

    setAccounts(accounts.map(account => 
      account.id === selectedAccount.id ? updatedAccount : account
    ));

    setNewTransaction({ amount: '', type: 'credit', description: '' });
    setShowAddTransaction(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Are you sure you want to delete this credit account?')) {
      setAccounts(accounts.filter(account => account.id !== accountId));
    }
  };

  const getAccountStatus = (account: CreditAccount) => {
    const utilizationRate = (account.currentBalance / account.creditLimit) * 100;
    if (utilizationRate > 80) return { status: 'overdue', color: 'red', text: 'Overdue' };
    if (utilizationRate > 0) return { status: 'active', color: 'yellow', text: 'Active' };
    return { status: 'paid', color: 'green', text: 'Paid' };
  };

  const getRecentTransactions = (account: CreditAccount) => {
    return account.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Sales Management</h1>
          <p className="text-gray-600 mt-2">Manage student credit accounts and transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Account</span>
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{totalAccounts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credit Limit</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalCreditLimit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Accounts</p>
              <p className="text-2xl font-bold text-red-600">{overdueAccounts}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Accounts</option>
          <option value="overdue">Overdue</option>
          <option value="active">Active</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Credit Accounts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Credit Accounts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAccounts.map((account) => {
            const status = getAccountStatus(account);
            const recentTransactions = getRecentTransactions(account);
            
            return (
              <div key={account.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{account.studentName}</p>
                      <p className="text-sm text-gray-600">{account.email}</p>
                      <p className="text-sm text-gray-500">ID: {account.studentId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Credit Limit</p>
                      <p className="font-semibold text-gray-900">₹{account.creditLimit.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className={`font-semibold ${
                        account.currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ₹{account.currentBalance.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Utilization</p>
                      <p className={`font-semibold ${
                        status.color === 'red' ? 'text-red-600' : 
                        status.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {((account.currentBalance / account.creditLimit) * 100).toFixed(1)}%
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.color === 'red' ? 'bg-red-100 text-red-800' :
                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowAddTransaction(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                {recentTransactions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</p>
                    <div className="space-y-2">
                      {recentTransactions.map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{transaction.date}</span>
                            <span className="text-gray-900">{transaction.description}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${
                              transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'payment' ? '-' : '+'}₹{transaction.amount}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'payment' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'purchase' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddAccount(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Credit Account</h2>
            
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={newAccount.studentName}
                  onChange={(e) => setNewAccount({ ...newAccount, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newAccount.creditLimit}
                  onChange={(e) => setNewAccount({ ...newAccount, creditLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newAccount.initialBalance}
                  onChange={(e) => setNewAccount({ ...newAccount, initialBalance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddTransaction(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Transaction</h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              {!selectedAccount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Account
                  </label>
                  <select
                    required
                    onChange={(e) => setSelectedAccount(accounts.find(acc => acc.id === e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.studentName} - ₹{account.currentBalance}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  required
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="credit">Credit (Add Money)</option>
                  <option value="payment">Payment (Deduct Money)</option>
                  <option value="purchase">Purchase (Deduct Money)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CreditSalesPage; 