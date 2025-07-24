import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  User, 
  Mail, 
  Wallet, 
  Plus, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

interface Student {
  uid: string;
  name: string;
  email: string;
  walletBalance: number;
  role: string;
}

const ManageWalletsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { userData } = useAuth();

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      setSearching(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        
        const studentsData: Student[] = [];
        querySnapshot.forEach((doc) => {
          studentsData.push({ uid: doc.id, ...doc.data() } as Student);
        });
        
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setMessage({ type: 'error', text: 'Failed to fetch students' });
      } finally {
        setSearching(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleTopUp = async () => {
    if (!selectedStudent || !amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    try {
      const amountNum = parseFloat(amount);
      const newBalance = selectedStudent.walletBalance + amountNum;

      // Update student's wallet balance
      const studentRef = doc(db, 'users', selectedStudent.uid);
      await updateDoc(studentRef, {
        walletBalance: newBalance
      });

      // Log the transaction
      await addDoc(collection(db, 'transactions'), {
        userId: selectedStudent.uid,
        amount: amountNum,
        type: 'credit',
        timestamp: serverTimestamp(),
        adminId: userData?.uid,
        adminName: userData?.name,
        previousBalance: selectedStudent.walletBalance,
        newBalance: newBalance
      });

      // Update local state
      const updatedStudents = students.map(student =>
        student.uid === selectedStudent.uid
          ? { ...student, walletBalance: newBalance }
          : student
      );
      setStudents(updatedStudents);
      setSelectedStudent({ ...selectedStudent, walletBalance: newBalance });

      setMessage({ type: 'success', text: `Successfully added $${amount} to ${selectedStudent.name}'s wallet` });
      setAmount('');
    } catch (error) {
      console.error('Error topping up wallet:', error);
      setMessage({ type: 'error', text: 'Failed to top up wallet' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Wallets</h1>
        <p className="text-gray-600 mt-2">Add credit to student accounts</p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Student</h2>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Students List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                <span className="ml-2 text-gray-600">Searching students...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No students found' : 'No students available'}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <motion.div
                  key={student.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudent?.uid === student.uid
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          ${student.walletBalance}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top Up Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Up Wallet</h2>
          
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Selected Student Info */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                    <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Wallet className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-primary-700">
                        Current Balance: ${selectedStudent.walletBalance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preview */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">New balance will be:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(selectedStudent.walletBalance + parseFloat(amount)).toFixed(2)}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleTopUp}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{loading ? 'Processing...' : 'Top Up Wallet'}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a student to top up their wallet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageWalletsPage; 