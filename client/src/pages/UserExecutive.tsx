import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Shield,
  Eye,
  X,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

interface UserExecutive {
  _id: string;
  userType: string;
  name: string;
  dateOfBirth: string;
  relationshipStatus: string;
  mobile: string;
  email?: string;
  aadharNumber: string;
  panNumber: string;
  pinCode: string;
  state: string;
  city: string;
  address: string;
  password: string;
  pointPercentage: number;
  referCode?: string;
  dealerCode?: string;
  totalEarnedPoints: number;
  availablePoints: number;
  referPoints: number;
  redeemAmount: number;
  referredBy?: {
    _id: string;
    name: string;
    mobile: string;
  };
  referredUsers: any[];
  totalReferredUsers: number;
  status: string;
  isVerified: boolean;
  verificationDate?: string;
  verifiedBy?: {
    firstName: string;
    lastName: string;
  };
  unverifyReason?: string;
  documents: any[];
  registrationDate: string;
  age?: number;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}

interface Statistics {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  executives: number;
  totalPoints: number;
  totalAvailablePoints: number;
}

const UserExecutive: React.FC = () => {
  const [users, setUsers] = useState<UserExecutive[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    activeUsers: 0,
    executives: 0,
    totalPoints: 0,
    totalAvailablePoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUserType, setFilterUserType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserExecutive | null>(null);
  const [formData, setFormData] = useState({
    userType: "Promoter",
    name: "",
    dateOfBirth: "",
    relationshipStatus: "Single",
    mobile: "",
    email: "",
    aadharNumber: "",
    panNumber: "",
    pinCode: "",
    state: "",
    city: "",
    address: "",
    password: "",
    pointPercentage: 100,
    referCode: "",
    dealerCode: "",
  });
  const [verificationData, setVerificationData] = useState({
    isVerified: false,
    reason: "",
  });
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiFailures, setApiFailures] = useState<
    Array<{
      timestamp: string;
      endpoint: string;
      method: string;
      error: string;
      status?: number;
      details?: any;
    }>
  >([]);
  const [showApiFailures, setShowApiFailures] = useState(false);

  const userTypes = [
    "Promoter",
    "Retailer",
    "Dealer",
    "Distributor",
    "Executive",
  ];
  const relationshipStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterUserType, filterStatus, filterVerified]);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing API connection...");
        const response = await axios.get("/api/health");
        console.log("API connection successful:", response.data);
      } catch (error: any) {
        console.error("API connection failed:", error);
        console.error("Base URL:", axios.defaults.baseURL);
        console.error("Headers:", axios.defaults.headers.common);
      }
    };
    testConnection();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(filterUserType !== "all" && { userType: filterUserType }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterVerified !== "all" && { isVerified: filterVerified }),
      });

      const response = await axios.get(`/api/user-executive?${params}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setStatistics(response.data.statistics);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      logApiFailure("/api/user-executive", "GET", error);
      alert("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      userType: "Promoter",
      name: "",
      dateOfBirth: "",
      relationshipStatus: "Single",
      mobile: "",
      email: "",
      aadharNumber: "",
      panNumber: "",
      pinCode: "",
      state: "",
      city: "",
      address: "",
      password: "",
      pointPercentage: 100,
      referCode: "",
      dealerCode: "",
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "userType",
      "name",
      "dateOfBirth",
      "mobile",
      "aadharNumber",
      "panNumber",
      "pinCode",
      "state",
      "city",
      "address",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate mobile number format
    if (!/^[6-9][0-9]{9}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9");
      return;
    }

    // Validate Aadhar number format
    if (!/^[0-9]{12}$/.test(formData.aadharNumber)) {
      alert("Please enter a valid 12-digit Aadhar number");
      return;
    }

    // Validate PAN number format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      alert("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }

    // Validate PIN code format
    if (!/^[0-9]{6}$/.test(formData.pinCode)) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    try {
      console.log("Sending form data:", formData);
      console.log("Current axios config:", {
        baseURL: axios.defaults.baseURL,
        headers: axios.defaults.headers.common,
      });

      const response = await axios.post("/api/user-executive", {
        ...formData,
        panNumber: formData.panNumber.toUpperCase(),
      });
      console.log("User created successfully:", response.data);
      alert("User created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      logApiFailure("/api/user-executive", "POST", error);

      if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
        alert(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to create users.");
      } else if (error.response?.status === 400) {
        alert(
          error.response?.data?.message ||
            "Invalid data provided. Please check all fields and try again."
        );
      } else if (error.response?.status >= 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(
          error.response?.data?.message ||
            `Error creating user: ${error.message}. Please try again.`
        );
      }
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validate required fields
    const requiredFields = [
      "userType",
      "name",
      "dateOfBirth",
      "mobile",
      "aadharNumber",
      "panNumber",
      "pinCode",
      "state",
      "city",
      "address",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate mobile number format
    if (!/^[6-9][0-9]{9}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9");
      return;
    }

    // Validate Aadhar number format
    if (!/^[0-9]{12}$/.test(formData.aadharNumber)) {
      alert("Please enter a valid 12-digit Aadhar number");
      return;
    }

    // Validate PAN number format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      alert("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }

    // Validate PIN code format
    if (!/^[0-9]{6}$/.test(formData.pinCode)) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    try {
      console.log("Updating user with data:", formData);
      const response = await axios.put(
        `/api/user-executive/${selectedUser._id}`,
        {
          ...formData,
          panNumber: formData.panNumber.toUpperCase(),
        }
      );
      console.log("User updated successfully:", response.data);
      alert("User updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      logApiFailure(`/api/user-executive/${selectedUser._id}`, "PUT", error);

      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to update users.");
      } else {
        alert(
          error.response?.data?.message ||
            `Error updating user: ${error.message}. Please try again.`
        );
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/user-executive/${userId}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting user. Please try again."
      );
    }
  };

  const handleVerification = async (
    userId: string,
    isVerified: boolean,
    reason?: string
  ) => {
    try {
      await axios.patch(`/api/user-executive/${userId}/verification`, {
        isVerified,
        reason,
      });
      alert(`User ${isVerified ? "verified" : "unverified"} successfully!`);
      fetchUsers();
      if (selectedUser && selectedUser._id === userId) {
        const response = await axios.get(`/api/user-executive/${userId}`);
        setSelectedUser(response.data);
      }
    } catch (error: any) {
      console.error("Error updating verification:", error);
      alert(
        error.response?.data?.message ||
          "Error updating verification. Please try again."
      );
    }
  };

  const openEditModal = (user: UserExecutive) => {
    setSelectedUser(user);
    setFormData({
      userType: user.userType,
      name: user.name,
      dateOfBirth: user.dateOfBirth.split("T")[0],
      relationshipStatus: user.relationshipStatus,
      mobile: user.mobile,
      email: user.email || "",
      aadharNumber: user.aadharNumber,
      panNumber: user.panNumber,
      pinCode: user.pinCode,
      state: user.state,
      city: user.city,
      address: user.address,
      password: user.password,
      pointPercentage: user.pointPercentage,
      referCode: user.referCode || "",
      dealerCode: user.dealerCode || "",
    });
    setShowEditModal(true);
  };

  const openDetailsModal = async (user: UserExecutive) => {
    try {
      const response = await axios.get(`/api/user-executive/${user._id}`);
      setSelectedUser(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error fetching user details. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, PNG, and PDF files are allowed");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setSelectedDocumentType(docType);
      setShowDocumentModal(true);
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile || !selectedUser || !selectedDocumentType) return;

    try {
      setUploadingDoc(selectedDocumentType);

      const formData = new FormData();
      formData.append(selectedDocumentType, selectedFile);

      await axios.post(
        `/api/user-executive/${selectedUser._id}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Document uploaded successfully!");

      // Refresh user data to show new document
      const response = await axios.get(
        `/api/user-executive/${selectedUser._id}`
      );
      setSelectedUser(response.data);

      // Close modal and reset state
      setShowDocumentModal(false);
      setSelectedFile(null);
      setSelectedDocumentType("");
    } catch (error: any) {
      console.error("Error uploading document:", error);
      logApiFailure(
        `/api/user-executive/${selectedUser._id}/documents`,
        "POST",
        error
      );
      alert(
        error.response?.data?.message ||
          "Error uploading document. Please try again."
      );
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDocumentDelete = async (docId: string) => {
    if (
      !selectedUser ||
      !window.confirm("Are you sure you want to delete this document?")
    )
      return;

    try {
      await axios.delete(
        `/api/user-executive/${selectedUser._id}/documents/${docId}`
      );
      alert("Document deleted successfully!");

      // Refresh user data
      const response = await axios.get(
        `/api/user-executive/${selectedUser._id}`
      );
      setSelectedUser(response.data);
    } catch (error: any) {
      console.error("Error deleting document:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting document. Please try again."
      );
    }
  };

  const handleDocumentView = (filename: string) => {
    window.open(`/api/user-executive/documents/${filename}`, "_blank");
  };

  const handleBulkUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      alert("Please select a CSV or Excel file");
      return;
    }

    // For now, show a message about bulk upload functionality
    alert(
      "Bulk upload functionality will be implemented. Please ensure your file has the following columns:\n\n" +
        "- userType\n" +
        "- name\n" +
        "- dateOfBirth (YYYY-MM-DD)\n" +
        "- mobile\n" +
        "- email\n" +
        "- aadharNumber\n" +
        "- panNumber\n" +
        "- pinCode\n" +
        "- state\n" +
        "- city\n" +
        "- address\n" +
        "- password\n" +
        "- pointPercentage\n" +
        "- relationshipStatus"
    );

    // Reset the input
    event.target.value = "";
  };

  const logApiFailure = (endpoint: string, method: string, error: any) => {
    const failure = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      error: error.message || "Unknown error",
      status: error.response?.status,
      details: {
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
        response: error.response?.data,
      },
    };

    setApiFailures((prev) => [failure, ...prev.slice(0, 9)]); // Keep last 10 failures
    console.error("API Failure logged:", failure);
  };

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection manually...");
      console.log("Base URL:", axios.defaults.baseURL);
      console.log("Headers:", axios.defaults.headers.common);

      const response = await axios.get("/api/health");
      console.log("API health check successful:", response.data);
      alert("API connection successful!");
    } catch (error: any) {
      console.error("API connection test failed:", error);
      logApiFailure("/api/health", "GET", error);
      alert(`API connection failed: ${error.message}`);
    }
  };

  const showFailureDetails = () => {
    setShowApiFailures(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          User & Executive Management
        </h1>
        <div className="flex space-x-3">
          {/* <button
            onClick={testApiConnection}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
            title="Test API Connection"
          >
            <span>Test API</span>
          </button> */}
          {/* <button
            onClick={showFailureDetails}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              apiFailures.length > 0
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            title={`Show API Failures (${apiFailures.length})`}
            disabled={apiFailures.length === 0}
          >
            <span>Failures ({apiFailures.length})</span>
          </button> */}
          <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleBulkUpload}
              className="hidden"
            />
            <Upload className="h-5 w-5" />
            <span>Bulk Upload</span>
          </label>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Verified Users
              </p>
              <p className="text-2xl font-bold text-green-600">
                {statistics.verifiedUsers}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unverified Users
              </p>
              <p className="text-2xl font-bold text-red-600">
                {statistics.unverifiedUsers}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executives</p>
              <p className="text-2xl font-bold text-purple-600">
                {statistics.executives}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            value={filterUserType}
            onChange={(e) => setFilterUserType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
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
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterUserType("all");
              setFilterStatus("all");
              setFilterVerified("all");
              setCurrentPage(1);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
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
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              {user.userType === "Executive" ? (
                                <Shield className="h-5 w-5 text-white" />
                              ) : (
                                <User className="h-5 w-5 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.aadharNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.mobile}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.userType === "Executive"
                              ? "bg-purple-100 text-purple-800"
                              : user.userType === "Dealer"
                              ? "bg-blue-100 text-blue-800"
                              : user.userType === "Distributor"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "Inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.availablePoints.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.registrationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailsModal(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleCreateUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New User
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select User Type *
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {userTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>

                    {/* Point Percentage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Point % *
                      </label>
                      <input
                        type="number"
                        name="pointPercentage"
                        value={formData.pointPercentage}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter DOB *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Relationship Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Relationship Status
                      </label>
                      <select
                        name="relationshipStatus"
                        value={formData.relationshipStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {relationshipStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Mobile No. *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        pattern="[6-9][0-9]{9}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Official Email ID
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Aadhar Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Number *
                      </label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{12}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 12-digit Aadhar number"
                      />
                    </div>

                    {/* PAN Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pan Number *
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        required
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter PAN number (e.g., ABCDE1234F)"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>

                    {/* Pin Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Pin Code *
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 6-digit pin code"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Registered State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city name"
                      />
                    </div>

                    {/* Refer Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refer Code
                      </label>
                      <input
                        type="text"
                        name="referCode"
                        value={formData.referCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter refer code"
                      />
                    </div>

                    {/* Dealer Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dealer Code
                      </label>
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

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Registered Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleEditUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit User - {selectedUser.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Same form fields as create modal */}
                    {/* User Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select User Type *
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {userTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>

                    {/* Point Percentage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Point % *
                      </label>
                      <input
                        type="number"
                        name="pointPercentage"
                        value={formData.pointPercentage}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter DOB *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Relationship Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Relationship Status
                      </label>
                      <select
                        name="relationshipStatus"
                        value={formData.relationshipStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {relationshipStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Mobile No. *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        pattern="[6-9][0-9]{9}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Official Email ID
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Aadhar Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Number *
                      </label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{12}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 12-digit Aadhar number"
                      />
                    </div>

                    {/* PAN Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pan Number *
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        required
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter PAN number (e.g., ABCDE1234F)"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>

                    {/* Pin Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Pin Code *
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 6-digit pin code"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Registered State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city name"
                      />
                    </div>

                    {/* Refer Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refer Code
                      </label>
                      <input
                        type="text"
                        name="referCode"
                        value={formData.referCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter refer code"
                      />
                    </div>

                    {/* Dealer Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dealer Code
                      </label>
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

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Registered Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                      resetForm();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl leading-6 font-bold text-red-600">
                    Welcome
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedUser(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Welcome Dashboard */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">
                      Date of registration:{" "}
                      {formatDateTime(selectedUser.registrationDate)}
                    </span>
                    {selectedUser.isVerified &&
                      selectedUser.verificationDate && (
                        <span className="text-green-600">
                          Date of verification:{" "}
                          {formatDateTime(selectedUser.verificationDate)}
                        </span>
                      )}
                  </div>

                  {/* Total Earned Points */}
                  <div className="border-2 border-green-500 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <p className="text-green-600 font-medium mb-2">
                        Total Earned Points (Till Now)
                      </p>
                      <p className="text-4xl font-bold text-green-600">
                        {selectedUser.totalEarnedPoints}
                      </p>
                    </div>
                  </div>

                  {/* Points Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Total Available Points</p>
                      <p className="text-2xl font-bold">
                        {selectedUser.availablePoints}
                      </p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Total Refer Points</p>
                      <p className="text-2xl font-bold">
                        {selectedUser.referPoints}
                      </p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Total Redeem Amount</p>
                      <p className="text-2xl font-bold">
                        {selectedUser.redeemAmount}
                      </p>
                    </div>
                  </div>

                  {/* Referral Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Referred By</p>
                      <p className="text-xl font-bold">
                        {selectedUser.referredBy
                          ? selectedUser.referredBy.name
                          : "Direct Registration"}
                      </p>
                    </div>
                    <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Total Referred User</p>
                      <p className="text-xl font-bold">
                        {selectedUser.totalReferredUsers}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Type:</span>
                        <span className="font-medium">
                          {selectedUser.userType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">
                          {formatDate(selectedUser.dateOfBirth)}
                        </span>
                      </div>
                      {selectedUser.age && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">
                            {selectedUser.age} years
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Relationship Status:
                        </span>
                        <span className="font-medium">
                          {selectedUser.relationshipStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Point Percentage:</span>
                        <span className="font-medium">
                          {selectedUser.pointPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-medium">
                          {selectedUser.mobile}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {selectedUser.email || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pin Code:</span>
                        <span className="font-medium">
                          {selectedUser.pinCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">
                          {selectedUser.state}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">City:</span>
                        <span className="font-medium">{selectedUser.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Document Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aadhar Number:</span>
                        <span className="font-medium">
                          {selectedUser.aadharNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PAN Number:</span>
                        <span className="font-medium">
                          {selectedUser.panNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refer Code:</span>
                        <span className="font-medium">
                          {selectedUser.referCode || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dealer Code:</span>
                        <span className="font-medium">
                          {selectedUser.dealerCode || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Address Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium mt-1">
                          {selectedUser.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Management */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Document Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      "aadhar_front",
                      "aadhar_back",
                      "pan_card",
                      "cancelled_check",
                    ].map((docType) => {
                      const document = selectedUser.documents?.find(
                        (doc) => doc.type === docType
                      );
                      const docLabels = {
                        aadhar_front: "Upload Aadhar",
                        aadhar_back: "Upload Aadhar Back",
                        pan_card: "Upload Pan",
                        cancelled_check: "Cancel Check",
                      };

                      return (
                        <div key={docType} className="text-center">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-2">
                            {document ? (
                              <img
                                src={`/api/user-executive/documents/${document.filename}`}
                                alt={
                                  docLabels[docType as keyof typeof docLabels]
                                }
                                className="w-full h-32 object-cover rounded cursor-pointer"
                                onClick={() =>
                                  handleDocumentView(document.filename)
                                }
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center text-gray-400">
                                <Upload className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {docLabels[docType as keyof typeof docLabels]}
                          </p>
                          <div className="flex space-x-2">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileSelect(e, docType)}
                                className="hidden"
                                disabled={uploadingDoc === docType}
                              />
                              <span
                                className={`block w-full text-center px-3 py-1 rounded text-sm cursor-pointer ${
                                  uploadingDoc === docType
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                {uploadingDoc === docType
                                  ? "Uploading..."
                                  : document
                                  ? "Update"
                                  : "Upload"}
                              </span>
                            </label>
                            {document && (
                              <button
                                onClick={() =>
                                  handleDocumentView(document.filename)
                                }
                                className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                              >
                                View
                              </button>
                            )}
                            {document && (
                              <button
                                onClick={() =>
                                  handleDocumentDelete(document._id)
                                }
                                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verification Section */}
                {!selectedUser.isVerified && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      User Verification
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Un verify Reason
                        </label>
                        <textarea
                          value={verificationData.reason}
                          onChange={(e) =>
                            setVerificationData((prev) => ({
                              ...prev,
                              reason: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter reason for verification decision..."
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() =>
                            handleVerification(
                              selectedUser._id,
                              true,
                              verificationData.reason
                            )
                          }
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(
                              selectedUser._id,
                              false,
                              verificationData.reason
                            )
                          }
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                {selectedUser.isVerified && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          User Verified
                        </span>
                      </div>
                      <div className="text-sm text-green-600">
                        Verified on:{" "}
                        {selectedUser.verificationDate &&
                          formatDateTime(selectedUser.verificationDate)}
                        {selectedUser.verifiedBy && (
                          <span className="block">
                            By: {selectedUser.verifiedBy.firstName}{" "}
                            {selectedUser.verifiedBy.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleVerification(
                          selectedUser._id,
                          false,
                          "Admin unverified user"
                        )
                      }
                      className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Unverify User
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedUser(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Confirmation Modal */}
      {showDocumentModal && selectedFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upload Document
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedFile(null);
                      setSelectedDocumentType("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Document Type:{" "}
                      <span className="font-medium">
                        {selectedDocumentType.replace("_", " ").toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      File:{" "}
                      <span className="font-medium">{selectedFile.name}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Size:{" "}
                      <span className="font-medium">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </p>
                  </div>

                  {selectedFile.type.startsWith("image/") && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDocumentUpload}
                  disabled={uploadingDoc === selectedDocumentType}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingDoc === selectedDocumentType
                    ? "Uploading..."
                    : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedFile(null);
                    setSelectedDocumentType("");
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Failures Modal */}
      {showApiFailures && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    API Failures Report ({apiFailures.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowApiFailures(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {apiFailures.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No API failures recorded.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {apiFailures.map((failure, index) => (
                        <div
                          key={index}
                          className="border border-red-200 rounded-lg p-4 bg-red-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-red-800">
                              {failure.method} {failure.endpoint}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(failure.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <strong>Status:</strong>{" "}
                                {failure.status || "No response"}
                              </p>
                              <p>
                                <strong>Error:</strong> {failure.error}
                              </p>
                              <p>
                                <strong>Code:</strong>{" "}
                                {failure.details?.code || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>URL:</strong>{" "}
                                {failure.details?.config?.url || "N/A"}
                              </p>
                              <p>
                                <strong>Base URL:</strong>{" "}
                                {failure.details?.config?.baseURL || "N/A"}
                              </p>
                            </div>
                          </div>

                          {failure.details?.response && (
                            <div className="mt-3">
                              <p className="font-medium text-red-700">
                                Response:
                              </p>
                              <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(
                                  failure.details.response,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setApiFailures([]);
                    setShowApiFailures(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Clear All Failures
                </button>
                <button
                  type="button"
                  onClick={() => setShowApiFailures(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserExecutive;
