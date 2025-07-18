import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, Mail, Phone, Clock, User, X } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ListSkeleton } from '../../components/common/SkeletonLoader';

const DashboardContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      toast.error('Failed to fetch contacts');
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    
    // Mark as read if unread
    if (contact.status === 'unread') {
      handleUpdateStatus(contact._id, 'read');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/contacts/${id}`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      setContacts(prev => prev.map(c => 
        c._id === id ? { ...c, status } : c
      ));
      
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(prev => ({ ...prev, status }));
      }
      
      toast.success(`Contact marked as ${status}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setContacts(prev => prev.filter(c => c._id !== id));
        toast.success('Contact message deleted successfully');
      } catch (err) {
        console.error('Error deleting contact:', err);
        toast.error('Failed to delete contact');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      unread: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unread' },
      read: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Read' },
      replied: { bg: 'bg-green-100', text: 'text-green-800', label: 'Replied' }
    };
    
    const config = statusConfig[status] || statusConfig.unread;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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

  const categories = ['All', 'Unread', 'Read', 'Replied'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-500">Total Messages: </span>
            <span className="font-semibold text-gray-900">{contacts.length}</span>
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
                  placeholder="Search contacts..."
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

        {/* Contacts List */}
        {loading ? (
          <ListSkeleton items={6} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{contact.subject || 'No Subject'}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-green-600 hover:text-green-900"
                            title="Reply"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
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

        {/* Contact Detail Modal */}
        {showModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedContact.subject || 'Contact Message'}</h3>
                    <p className="text-gray-600 mt-1">From: {selectedContact.name}</p>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedContact.name}</h4>
                        <p className="text-gray-600">{selectedContact.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(selectedContact.status)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Received on {formatDate(selectedContact.createdAt)}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                    <p className="text-gray-700 leading-relaxed">{selectedContact.message}</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'replied')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Replied
                    </button>
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
                    >
                      Reply via Email
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

export default DashboardContacts;