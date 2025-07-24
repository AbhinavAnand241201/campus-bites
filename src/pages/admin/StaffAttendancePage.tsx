import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { staffMembers } from '../../lib/sampleData';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  attendance: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    hours: number;
  }>;
}

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

const StaffAttendancePage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(staffMembers);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});

  // Form states
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    hourlyRate: ''
  });

  const [attendanceForm, setAttendanceForm] = useState({
    checkIn: '',
    checkOut: '',
    hours: ''
  });

  // Calculate staff statistics
  const totalStaff = staff.length;
  const presentToday = staff.filter(member => 
    member.attendance.some(record => record.date === selectedDate)
  ).length;
  const absentToday = totalStaff - presentToday;

  const totalHoursThisMonth = staff.reduce((total, member) => {
    const thisMonthRecords = member.attendance.filter(record => {
      const recordDate = new Date(record.date);
      const currentDate = new Date();
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    });
    return total + thisMonthRecords.reduce((sum, record) => sum + record.hours, 0);
  }, 0);

  const totalSalaryThisMonth = staff.reduce((total, member) => {
    const thisMonthRecords = member.attendance.filter(record => {
      const recordDate = new Date(record.date);
      const currentDate = new Date();
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    });
    const totalHours = thisMonthRecords.reduce((sum, record) => sum + record.hours, 0);
    return total + (totalHours * member.hourlyRate);
  }, 0);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaffMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name,
      role: newStaff.role,
      hourlyRate: parseFloat(newStaff.hourlyRate),
      attendance: []
    };
    setStaff([...staff, newStaffMember]);
    setNewStaff({ name: '', role: '', hourlyRate: '' });
    setShowAddStaff(false);
  };

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const hours = parseFloat(attendanceForm.hours);
    const status = hours >= 8 ? 'present' : hours >= 4 ? 'half-day' : 'late';

    const newAttendance = {
      date: selectedDate,
      checkIn: attendanceForm.checkIn,
      checkOut: attendanceForm.checkOut,
      hours: hours,
      status: status
    };

    const updatedStaff = staff.map(member => 
      member.id === selectedStaff.id 
        ? { ...member, attendance: [...member.attendance, newAttendance] }
        : member
    );

    setStaff(updatedStaff);
    setAttendanceForm({ checkIn: '', checkOut: '', hours: '' });
    setShowAttendanceForm(false);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(member => member.id !== staffId));
    }
  };

  const getStaffAttendanceForDate = (member: StaffMember, date: string) => {
    return member.attendance.find(record => record.date === date);
  };

  const getMonthlyStats = (member: StaffMember) => {
    const currentDate = new Date();
    const thisMonthRecords = member.attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    });

    const totalHours = thisMonthRecords.reduce((sum, record) => sum + record.hours, 0);
    const totalSalary = totalHours * member.hourlyRate;
    const attendanceRate = (thisMonthRecords.length / 22) * 100; // Assuming 22 working days

    return { totalHours, totalSalary, attendanceRate };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Attendance</h1>
          <p className="text-gray-600 mt-2">Track staff attendance and manage salaries</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddStaff(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Staff</span>
          </button>
          <button
            onClick={() => setShowAttendanceForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span>Mark Attendance</span>
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
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
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
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{presentToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{absentToday}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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
              <p className="text-sm font-medium text-gray-600">Monthly Salary</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSalaryThisMonth.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staff List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {staff.map((member) => {
            const stats = getMonthlyStats(member);
            const todayAttendance = getStaffAttendanceForDate(member, selectedDate);
            
            return (
              <div key={member.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">₹{member.hourlyRate}/hour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="font-semibold text-gray-900">{stats.totalHours}h</p>
                      <p className="text-sm text-gray-500">₹{stats.totalSalary.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                      <p className={`font-semibold ${
                        stats.attendanceRate >= 90 ? 'text-green-600' : 
                        stats.attendanceRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stats.attendanceRate.toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Today</p>
                      {todayAttendance ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">{todayAttendance.hours}h</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Absent</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowAttendanceForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddStaff(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Staff Member</h2>
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newStaff.hourlyRate}
                  onChange={(e) => setNewStaff({ ...newStaff, hourlyRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Staff
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Mark Attendance Modal */}
      {showAttendanceForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAttendanceForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Attendance</h2>
            
            <form onSubmit={handleAddAttendance} className="space-y-4">
              {!selectedStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Staff Member
                  </label>
                  <select
                    required
                    onChange={(e) => setSelectedStaff(staff.find(s => s.id === e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose staff member</option>
                    {staff.map(member => (
                      <option key={member.id} value={member.id}>{member.name} - {member.role}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check In
                  </label>
                  <input
                    type="time"
                    required
                    value={attendanceForm.checkIn}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check Out
                  </label>
                  <input
                    type="time"
                    required
                    value={attendanceForm.checkOut}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Hours
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="24"
                  step="0.5"
                  value={attendanceForm.hours}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, hours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Attendance
                </button>
                <button
                  type="button"
                  onClick={() => setShowAttendanceForm(false)}
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

export default StaffAttendancePage; 