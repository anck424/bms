import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, Mail, Phone, Clock, User, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ListSkeleton } from '../../components/common/SkeletonLoader';

const DashboardEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setEnrollments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      toast.error('Failed to fetch enrollments');
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      `${enrollment.firstName} ${enrollment.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || enrollment.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/enrollments/${id}`, 
        { status: newStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      setEnrollments(prev => prev.map(e => 
        e._id === id ? { ...e, status: newStatus } : e
      ));
      
      if (selectedEnrollment && selectedEnrollment._id === id) {
        setSelectedEnrollment(prev => ({ ...prev, status: newStatus }));
      }
      
      toast.success(`Enrollment status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update enrollment status');
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/enrollments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setEnrollments(prev => prev.filter(e => e._id !== id));
        toast.success('Enrollment deleted successfully');
      } catch (err) {
        console.error('Error deleting enrollment:', err);
        toast.error('Failed to delete enrollment');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: AlertCircle },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: XCircle },
      enrolled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enrolled', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    return {
      total: enrollments.length,
      pending: enrollments.filter(e => e.status === 'pending').length,
      approved: enrollments.filter(e => e.status === 'approved').length,
      enrolled: enrollments.filter(e => e.status === 'enrolled').length,
    };
  };

  const statusCounts = getStatusCounts();
  const categories = ['All', 'Pending', 'Approved', 'Rejected', 'Enrolled'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Course Enrollments</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{statusCounts.total}</div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{statusCounts.pending}</div>
            <div className="text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{statusCounts.approved}</div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{statusCounts.enrolled}</div>
            <div className="text-gray-600">Enrolled</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enrollments List */}
        {loading ? (
          <ListSkeleton items={6} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.firstName} {enrollment.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{enrollment.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{enrollment.course}</div>
                        <div className="text-sm text-gray-500">
                          Start Date: {enrollment.startDate ? new Date(enrollment.startDate).toLocaleDateString() : 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDate(enrollment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(enrollment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewEnrollment(enrollment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={`mailto:${enrollment.email}`}
                            className="text-green-600 hover:text-green-900"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          <a
                            href={`tel:${enrollment.phone}`}
                            className="text-purple-600 hover:text-purple-900"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteEnrollment(enrollment._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
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
          </div>
        )}

        {/* Enrollment Detail Modal */}
        {showModal && selectedEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Enrollment Application</h3>
                    <p className="text-gray-600 mt-1">
                      {selectedEnrollment.firstName} {selectedEnrollment.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {selectedEnrollment.firstName} {selectedEnrollment.lastName}
                        </h4>
                        <p className="text-gray-600">{selectedEnrollment.email}</p>
                        <p className="text-gray-600">{selectedEnrollment.phone}</p>
                      </div>
                    </div>
                    {getStatusBadge(selectedEnrollment.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Course Information</h5>
                      <p className="text-gray-700">{selectedEnrollment.course}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Preferred Start: {selectedEnrollment.startDate ? new Date(selectedEnrollment.startDate).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Education Background</h5>
                      <p className="text-gray-700">{selectedEnrollment.education || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Applied on {formatDate(selectedEnrollment.createdAt)}
                  </div>
                  
                  {/* Status Update Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="font-medium text-gray-900 mb-4">Update Status</h5>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedEnrollment._id, 'approved')}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedEnrollment._id, 'rejected')}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedEnrollment._id, 'enrolled')}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark as Enrolled
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedEnrollment._id, 'pending')}
                        className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        Mark as Pending
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <a
                      href={`mailto:${selectedEnrollment.email}?subject=Regarding your course enrollment application`}
                      className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors text-center"
                    >
                      Send Email
                    </a>
                    <a
                      href={`tel:${selectedEnrollment.phone}`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
                    >
                      Call Student
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEnrollments;