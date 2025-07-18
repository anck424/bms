import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Save, Eye, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ListSkeleton } from '../../components/common/SkeletonLoader';

const DashboardCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    courseCode: '',
    courseName: '',
    subtitle: '',
    image: '',
    banner: '',
    details: '',
    description: '',
    preview: '',
    skills: [],
    eligibility: [],
    duration: '',
    students: 0,
    fees: {
      original: 0,
      discounted: 0,
      currency: 'Rs.'
    },
    rating: 4.0,
    reviews: 0,
    instructor: '',
    syllabus: [],
    benefits: [],
    certificate: {
      image: '',
      criteria: []
    },
    features: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      // Flatten courses for easier management
      const flattenedCourses = response.data.flatMap(category =>
        category.courses.map(course => ({
          ...course,
          category: category.category
        }))
      );
      
      setCourses(flattenedCourses);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to fetch courses');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSyllabusChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSyllabusModule = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { module: '', topics: [''], duration: '' }]
    }));
  };

  const removeSyllabusModule = (index) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file, type) => {
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses/upload`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === 'image') {
        setFormData(prev => ({ ...prev, image: response.data.url }));
        setImagePreview(response.data.url);
      } else if (type === 'banner') {
        setFormData(prev => ({ ...prev, banner: response.data.url }));
        setBannerPreview(response.data.url);
      }

      toast.success(`${type} uploaded successfully`);
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      toast.error(`Failed to upload ${type}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses/${currentCourse.courseCode}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success('Course added successfully');
      }

      fetchCourses();
      resetForm();
    } catch (err) {
      console.error('Error saving course:', err);
      toast.error('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData(course);
    if (course.image) setImagePreview(course.image);
    if (course.banner) setBannerPreview(course.banner);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (courseCode) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses/${courseCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setCourses(courses.filter(c => c.courseCode !== courseCode));
        toast.success('Course deleted successfully');
      } catch (err) {
        console.error('Error deleting course:', err);
        toast.error('Failed to delete course');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      courseCode: '',
      courseName: '',
      subtitle: '',
      image: '',
      banner: '',
      details: '',
      description: '',
      preview: '',
      skills: [],
      eligibility: [],
      duration: '',
      students: 0,
      fees: {
        original: 0,
        discounted: 0,
        currency: 'Rs.'
      },
      rating: 4.0,
      reviews: 0,
      instructor: '',
      syllabus: [],
      benefits: [],
      certificate: {
        image: '',
        criteria: []
      },
      features: []
    });
    setImageFile(null);
    setImagePreview('');
    setBannerFile(null);
    setBannerPreview('');
    setCurrentCourse(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Courses Management</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Course Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

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
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Image Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        handleImageUpload(file, 'image');
                      }
                    }}
                    className="w-full p-2 border rounded"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setBannerFile(file);
                        handleImageUpload(file, 'banner');
                      }
                    }}
                    className="w-full p-2 border rounded"
                  />
                  {bannerPreview && (
                    <img src={bannerPreview} alt="Banner Preview" className="mt-2 h-20 w-32 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* Description */}
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
                />
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Students
                  </label>
                  <input
                    type="number"
                    name="students"
                    value={formData.students}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
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
                  />
                </div>
              </div>

              {/* Fees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Fee
                  </label>
                  <input
                    type="number"
                    name="fees.original"
                    value={formData.fees.original}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discounted Fee
                  </label>
                  <input
                    type="number"
                    name="fees.discounted"
                    value={formData.fees.discounted}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="fees.currency"
                    value={formData.fees.currency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayInputChange('skills', index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Enter skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('skills', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skills')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Skill
                </button>
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
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        {loading ? (
          <ListSkeleton items={6} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.courseCode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={course.image || '/placeholder-course.jpg'}
                            alt={course.courseName}
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.courseName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.courseCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.students?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.fees?.currency} {course.fees?.discounted?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(`/courses/${course.courseCode}`, '_blank')}
                            className="text-green-600 hover:text-green-900"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.courseCode)}
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

export default DashboardCourses;