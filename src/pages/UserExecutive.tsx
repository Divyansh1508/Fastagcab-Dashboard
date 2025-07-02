import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, User, Shield, Eye, EyeOff, Upload, X, Save, Check, AlertCircle, FileText, Calendar, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'User' | 'Executive' | 'Promoter' | 'Retailer' | 'Dealer' | 'Distributor';
  status: 'Active' | 'Inactive' | 'Verified' | 'Unverified';
  joinDate: string;
  points: number;
  dob?: string;
  relationshipStatus?: string;
  aadharNumber?: string;
  panNumber?: string;
  pinCode?: string;
  state?: string;
  city?: string;
  address?: string;
  referCode?: string;
  dealerCode?: string;
  documents?: {
    aadharFront?: string;
    aadharBack?: string;
    panCard?: string;
    cancelledCheck?: string;
  };
  verificationDate?: string;
  registrationDate?: string;
  totalEarnedPoints?: number;
  availablePoints?: number;
  referPoints?: number;
  redeemAmount?: number;
  referredBy?: string;
  totalReferredUsers?: number;
}

const UserExecutive: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Akhilesh Kumar',
      email: 'akhilesh@example.com',
      phone: '+91 9598323233',
      role: 'Promoter',
      status: 'Verified',
      joinDate: '2024-01-15',
      points: 866,
      dob: '1990-08-10',
      relationshipStatus: 'Single',
      aadharNumber: '788814129228',
      panNumber: 'LILPK2831Q',
      pinCode: '228121',
      state: 'Uttar Pradesh',
      city: 'Sultanpur',
      address: 'Haraura bazar',
      referCode: 'WT71GU',
      dealerCode: 'DL001',
      registrationDate: '2024-12-25 19:05:33.000000',
      verificationDate: '2025-01-11 09:12:39',
      totalEarnedPoints: 866,
      availablePoints: 866,
      referPoints: 1,
      redeemAmount: 0,
      referredBy: 'Durgesh Singh',
      totalReferredUsers: 0,
      documents: {
        aadharFront: 'aadhar-front.jpg',
        aadharBack: 'aadhar-back.jpg',
        panCard: 'pan-card.jpg',
        cancelledCheck: 'cancelled-check.jpg'
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      role: 'Executive',
      status: 'Active',
      joinDate: '2024-01-10',
      points: 5000,
      totalEarnedPoints: 5000,
      availablePoints: 5000,
      referPoints: 5,
      redeemAmount: 500,
      totalReferredUsers: 3
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      role: 'User',
      status: 'Unverified',
      joinDate: '2024-01-12',
      points: 100,
      totalEarnedPoints: 100,
      availablePoints: 100,
      referPoints: 0,
      redeemAmount: 0,
      totalReferredUsers: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationReason, setVerificationReason] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'verify' | 'unverify'>('verify');
  const [formData, setFormData] = useState({
    userType: 'Promoter',
    name: '',
    password: '',
    pointPercentage: '',
    dob: '',
    relationshipStatus: 'Single',
    mobile: '',
    email: '',
    aadharNumber: '',
    panNumber: '',
    pinCode: '',
    state: 'Uttar Pradesh',
    city: 'Sultanpur',
    address: '',
    referCode: '',
    dealerCode: '',
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    panCard: null as File | null,
    cancelledCheck: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const userTypes = ['Promoter', 'Retailer', 'Dealer', 'Distributor', 'Executive', 'User'];
  const relationshipStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const states = ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Madhya Pradesh'];
  const cities = ['Sultanpur', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.pointPercentage.trim()) {
      newErrors.pointPercentage = 'Point percentage is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }

    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        role: formData.userType as User['role'],
        status: 'Unverified',
        joinDate: new Date().toISOString().split('T')[0],
        points: 0,
        dob: formData.dob,
        relationshipStatus: formData.relationshipStatus,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        pinCode: formData.pinCode,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        referCode: formData.referCode,
        dealerCode: formData.dealerCode,
        registrationDate: new Date().toISOString(),
        totalEarnedPoints: 0,
        availablePoints: 0,
        referPoints: 0,
        redeemAmount: 0,
        totalReferredUsers: 0
      };

      setUsers([...users, newUser]);
      setShowCreateForm(false);
      resetForm();
      alert('User created successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      userType: 'Promoter',
      name: '',
      password: '',
      pointPercentage: '',
      dob: '',
      relationshipStatus: 'Single',
      mobile: '',
      email: '',
      aadharNumber: '',
      panNumber: '',
      pinCode: '',
      state: 'Uttar Pradesh',
      city: 'Sultanpur',
      address: '',
      referCode: '',
      dealerCode: '',
      aadharFront: null,
      aadharBack: null,
      panCard: null,
      cancelledCheck: null
    });
    setErrors({});
  };

  const handleVerification = (user: User, action: 'verify' | 'unverify') => {
    setSelectedUser(user);
    setVerificationAction(action);
    setShowVerificationModal(true);
  };

  const submitVerification = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              status: verificationAction === 'verify' ? 'Verified' : 'Unverified',
              verificationDate: verificationAction === 'verify' ? new Date().toISOString() : undefined
            }
          : user
      );
      setUsers(updatedUsers);
      setShowVerificationModal(false);
      setVerificationReason('');
      setSelectedUser(null);
    }
  };

  const FileUploadField = ({ label, fieldName, accept = "image/*" }: { label: string; fieldName: string; accept?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, fieldName)}
          className="hidden"
          id={fieldName}
        />
        <label htmlFor={fieldName} className="cursor-pointer">
          {formData[fieldName as keyof typeof formData] ? (
            <div className="text-green-600">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">File selected</p>
            </div>
          ) : (
            <div className="text-gray-400">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Click to upload</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  const UserDetailsModal = ({ user }: { user: User }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Welcome</h2>
                    <p className="text-blue-100">{user.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Registration and Verification Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Date of registration:</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.registrationDate || '2024-12-25 19:05:33.000000'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Date of verification:</p>
                  <p className="text-lg font-medium text-green-600">
                    {user.verificationDate || '2025-01-11 09:12:39'}
                  </p>
                </div>
              </div>

              {/* Points Summary */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">Total Earned Points (Till Now)</p>
                  <p className="text-4xl font-bold text-green-700">{user.totalEarnedPoints || user.points}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Total Available Points</p>
                  <p className="text-2xl font-bold">{user.availablePoints || user.points}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Total Refer Points</p>
                  <p className="text-2xl font-bold">{user.referPoints || 1}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Total Redeem Amount</p>
                  <p className="text-2xl font-bold">{user.redeemAmount || 0}</p>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Total Referred User</p>
                  <p className="text-2xl font-bold">{user.totalReferredUsers || 0}</p>
                </div>
              </div>

              {/* Referral Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Referred By</p>
                  <p className="text-xl font-bold">{user.referredBy || 'Durgesh Singh'}</p>
                </div>
                <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">Total Referred User</p>
                  <p className="text-xl font-bold">{user.totalReferredUsers || 0}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">DOB:</span>
                      <span className="text-sm font-medium">{user.dob || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Role:</span>
                      <span className="text-sm font-medium">{user.role}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium">{user.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Aadhar:</span>
                      <span className="text-sm font-medium">{user.aadharNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">PAN:</span>
                      <span className="text-sm font-medium">{user.panNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Images */}
              {user.documents && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user.documents.aadharFront && (
                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Upload Aadhar</h4>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded">Update</button>
                          <button className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded">View</button>
                        </div>
                      </div>
                    )}
                    {user.documents.aadharBack && (
                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Upload Aadhar Back</h4>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded">Update</button>
                          <button className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded">View</button>
                        </div>
                      </div>
                    )}
                    {user.documents.panCard && (
                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Upload Pan</h4>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded">Update Pan</button>
                          <button className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded">View</button>
                        </div>
                      </div>
                    )}
                    {user.documents.cancelledCheck && (
                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Cancel Check</h4>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded">Update check</button>
                          <button className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded">View</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Section */}
              {user.status === 'Unverified' && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Actions</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Un verify Reason
                    </label>
                    <textarea
                      value={verificationReason}
                      onChange={(e) => setVerificationReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter reason for verification status..."
                    />
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleVerification(user, 'verify')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setShowUserDetails(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User & Executive Management</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'Verified').length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unverified Users</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'Unverified').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executives</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'Executive').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Create User Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select User Type</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {userTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Akhilesh kumar"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12345"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Point % *</label>
                    <input
                      type="number"
                      name="pointPercentage"
                      value={formData.pointPercentage}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pointPercentage ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="100"
                    />
                    {errors.pointPercentage && <p className="mt-1 text-sm text-red-600">{errors.pointPercentage}</p>}
                  </div>
                </div>

                {/* DOB and Relationship */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter DOB</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Relationship Status</label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {relationshipStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Mobile No. *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9598323233"
                    />
                    {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Official Email ID</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                {/* Aadhar and PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="788814129228"
                    />
                    {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pan Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.panNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="LILPK2831Q"
                    />
                    {errors.panNumber && <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>}
                  </div>
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Pin Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pinCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="228121"
                    />
                    {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Registered State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address and Codes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Registered Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Haraura bazar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refer Code</label>
                    <input
                      type="text"
                      name="referCode"
                      value={formData.referCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="WT71GU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Code</label>
                    <input
                      type="text"
                      name="dealerCode"
                      value={formData.dealerCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter dealer code"
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FileUploadField label="Upload Aadhar" fieldName="aadharFront" />
                  <FileUploadField label="Upload Aadhar Back" fieldName="aadharBack" />
                  <FileUploadField label="Upload Pan" fieldName="panCard" />
                  <FileUploadField label="Cancel Check" fieldName="cancelledCheck" />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Create User</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal user={selectedUser} />
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {verificationAction === 'verify' ? 'Verify User' : 'Unverify User'}
                    </h3>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Are you sure you want to {verificationAction} {selectedUser.name}?
                      </p>
                      <textarea
                        value={verificationReason}
                        onChange={(e) => setVerificationReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter reason (optional)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={submitVerification}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    verificationAction === 'verify' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {verificationAction === 'verify' ? 'Verify' : 'Unverify'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {userTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          {user.role === 'Executive' ? (
                            <Shield className="h-5 w-5 text-white" />
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Executive' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'Promoter'
                        ? 'bg-yellow-100 text-yellow-800'
                        : user.role === 'Retailer'
                        ? 'bg-green-100 text-green-800'
                        : user.role === 'Dealer'
                        ? 'bg-orange-100 text-orange-800'
                        : user.role === 'Distributor'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' || user.status === 'Verified'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'Inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.status === 'Verified' ? (
                        <button 
                          onClick={() => handleVerification(user, 'unverify')}
                          className="text-red-600 hover:text-red-900"
                          title="Unverify"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleVerification(user, 'verify')}
                          className="text-green-600 hover:text-green-900"
                          title="Verify"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserExecutive;