import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, X, Tag, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ListSkeleton } from '../../components/common/SkeletonLoader';

const DashboardOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    validUntil: '',
    description: '',
    code: '',
    conditions: [''],
    isActive: true
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setOffers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offers:', err);
      toast.error('Failed to fetch offers');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConditionChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => i === index ? value : condition)
    }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, '']
    }));
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Filter out empty conditions
      const cleanedData = {
        ...formData,
        conditions: formData.conditions.filter(condition => condition.trim() !== '')
      };
      
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/offers/${currentOffer._id}`, cleanedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Offer updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/offers`, cleanedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Offer added successfully');
      }

      fetchOffers();
      resetForm();
    } catch (err) {
      console.error('Error saving offer:', err);
      toast.error('Failed to save offer');
    }
  };

  const handleEdit = (offer) => {
    setCurrentOffer(offer);
    setFormData({
      title: offer.title,
      discount: offer.discount,
      validUntil: new Date(offer.validUntil).toISOString().split('T')[0],
      description: offer.description,
      code: offer.code,
      conditions: offer.conditions.length > 0 ? offer.conditions : [''],
      isActive: offer.isActive
    });
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/offers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setOffers(offers.filter(o => o._id !== id));
        toast.success('Offer deleted successfully');
      } catch (err) {
        console.error('Error deleting offer:', err);
        toast.error('Failed to delete offer');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount: '',
      validUntil: '',
      description: '',
      code: '',
      conditions: [''],
      isActive: true
    });
    setCurrentOffer(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Active' && offer.isActive && new Date(offer.validUntil) >= new Date()) ||
                         (statusFilter === 'Expired' && new Date(offer.validUntil) < new Date()) ||
                         (statusFilter === 'Inactive' && !offer.isActive);
    return matchesSearch && matchesStatus;
  });

  const isOfferExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  const getStatusBadge = (offer) => {
    if (!offer.isActive) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
    }
    if (isOfferExpired(offer.validUntil)) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  };

  const categories = ['All', 'Active', 'Expired', 'Inactive'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offers & Schemes Management</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Offer
          </button>
        </div>

        {/* Add/Edit Offer Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., 25% OFF"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., EARLY25"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions
                </label>
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => handleConditionChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Enter condition"
                    />
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Condition
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  id="active-checkbox"
                />
                <label htmlFor="active-checkbox" className="ml-2 block text-sm text-gray-700">
                  Active Offer
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update Offer' : 'Add Offer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search offers..."
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

        {/* Offers List */}
        {loading ? (
          <ListSkeleton items={6} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Until
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
                  {filteredOffers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                            <div className="text-sm text-gray-500">{offer.discount}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{offer.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(offer.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(offer)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(offer._id)}
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
      </div>
    </div>
  );
};

export default DashboardOffers;