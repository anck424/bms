import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, BookOpen, MessageSquare, Users, Mail, BarChart3, Settings, FileText, Calendar } from 'lucide-react';
import { DashboardCardSkeleton } from '../components/common/SkeletonLoader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalTestimonials: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);

  const adminName = 'Alice';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/dashboard-login');
    } else {
      fetchDashboardStats();
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch courses
      const coursesResponse = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses`);
      const coursesData = await coursesResponse.json();
      
      // Fetch testimonials
      const testimonialsResponse = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/testimonials`);
      const testimonialsData = await testimonialsResponse.json();
      
      // Calculate total courses and students
      const totalCourses = coursesData.reduce((sum, category) => sum + category.courses.length, 0);
      const totalStudents = coursesData.reduce((sum, category) => 
        sum + category.courses.reduce((courseSum, course) => courseSum + (course.students || 0), 0), 0
      );
      
      setStats({
        totalCourses,
        totalStudents,
        totalTestimonials: testimonialsData.length,
        totalContacts: 0 // This would need a contacts API endpoint
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/dashboard-login');
  };

  const cards = [
    {
      title: 'Courses',
      description: 'Manage course listings and categories',
      bg: 'bg-blue-100',
      icon: <BookOpen className="w-6 h-6" />,
      cardLink: '/dashboard/courses',
      count: stats.totalCourses
    },
    {
      title: 'Enrollments',
      description: 'Manage student enrollment applications',
      bg: 'bg-indigo-100',
      icon: <Users className="w-6 h-6" />,
      cardLink: '/dashboard/enrollments',
      count: null
    },
    {
      title: 'Testimonials',
      description: 'Manage client testimonials',
      bg: 'bg-yellow-200',
      icon: <MessageSquare className="w-6 h-6" />,
      cardLink: '/dashboard/testimonials',
      count: stats.totalTestimonials
    },
    {
      title: 'Contact Messages',
      description: 'View and manage contact messages',
      bg: 'bg-purple-100',
      icon: <Mail className="w-6 h-6" />,
      cardLink: '/dashboard/contacts',
      count: stats.totalContacts
    },
    {
      title: 'Analytics',
      description: 'View performance analytics',
      bg: 'bg-indigo-100',
      icon: <BarChart3 className="w-6 h-6" />,
      cardLink: '/dashboard/analytics',
      count: null
    },
    {
      title: 'Settings',
      description: 'Manage system settings',
      bg: 'bg-gray-100',
      icon: <Settings className="w-6 h-6" />,
      cardLink: '/dashboard/settings',
      count: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between relative">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg select-none">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Cards Section */}
      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalCourses}</div>
                <div className="text-gray-600">Total Courses</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-gray-600">Total Students</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalTestimonials}</div>
                <div className="text-gray-600">Testimonials</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalContacts}</div>
                <div className="text-gray-600">Contact Messages</div>
              </div>
            </>
          )}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))
          ) : (
            cards.map((card, index) => (
              <Link key={index} to={card.cardLink || '#'}>
                <div className="bg-white rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-full p-3 ${card.bg}`}>
                      {card.icon}
                    </div>
                    {card.count !== null && (
                      <div className="text-2xl font-bold text-gray-700">{card.count}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/courses" className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-800">Add New Course</span>
              </div>
            </Link>
            <Link to="/dashboard/testimonials" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="font-medium text-yellow-800">Add Testimonial</span>
              </div>
            </Link>
            <button className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-green-800">Generate Report</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">New course "React Development" added</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">New testimonial received</span>
                  </div>
                  <span className="text-sm text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Course "Python Basics" updated</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Profile Info</h2>
            <p><strong>Name:</strong> {adminName}</p>
            <p><strong>Role:</strong> Administrator</p>
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
