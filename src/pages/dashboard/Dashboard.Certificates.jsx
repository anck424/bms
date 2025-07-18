import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, X, Award, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ListSkeleton } from '../../components/common/SkeletonLoader';

const DashboardCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    completionDate: '',
    issueDate: '',
    grade: '',
    instructor: '',
    duration: '',
    skills: [''],
    isValid: true
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCertificates(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toast.error('Failed to fetch certificates');
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

  const handleSkillChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const generateCertificateId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const courseCode = formData.courseName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    return `BMS-${year}-${courseCode}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Filter out empty skills
      const cleanedData = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        certificateId: formData.certificateId || generateCertificateId()
      };
      
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/certificates/${currentCertificate._id}`, cleanedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Certificate updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/certificates`, cleanedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Certificate added successfully');
      }

      fetchCertificates();
      resetForm();
    } catch (err) {
      console.error('Error saving certificate:', err);
      toast.error('Failed to save certificate');
    }
  };

  const handleEdit = (certificate) => {
    setCurrentCertificate(certificate);
    setFormData({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      completionDate: new Date(certificate.completionDate).toISOString().split('T')[0],
      issueDate: new Date(certificate.issueDate).toISOString().split('T')[0],
      grade: certificate.grade,
      instructor: certificate.instructor,
      duration: certificate.duration,
      skills: certificate.skills.length > 0 ? certificate.skills : [''],
      isValid: certificate.isValid
    });
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setCertificates(certificates.filter(c => c._id !== id));
        toast.success('Certificate deleted successfully');
      } catch (err) {
        console.error('Error deleting certificate:', err);
        toast.error('Failed to delete certificate');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      certificateId: '',
      studentName: '',
      courseName: '',
      completionDate: '',
      issueDate: '',
      grade: '',
      instructor: '',
      duration: '',
      skills: [''],
      isValid: true
    });
    setCurrentCertificate(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (isValid) => {
    return isValid ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Valid</span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Invalid</span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Certificate Management</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Certificate
          </button>
        </div>

        {/* Add/Edit Certificate Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Certificate' : 'Add New Certificate'}
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
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    name="certificateId"
                    value={formData.certificateId}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 24 Weeks"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Enter skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isValid"
                  checked={formData.isValid}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  id="valid-checkbox"
                />
                <label htmlFor="valid-checkbox" className="ml-2 block text-sm text-gray-700">
                  Valid Certificate
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
                  {isEditing ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Certificates List */}
        {loading ? (
          <ListSkeleton items={6} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
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
                  {filteredCertificates.map((certificate) => (
                    <tr key={certificate._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{certificate.certificateId}</div>
                            <div className="text-sm text-gray-500">Grade: {certificate.grade}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{certificate.courseName}</div>
                        <div className="text-sm text-gray-500">{certificate.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(certificate.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(certificate.isValid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(certificate)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(certificate._id)}
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

export default DashboardCertificates;