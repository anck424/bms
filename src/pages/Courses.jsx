import React, { useState, useEffect } from 'react';
import { Search, Star, Users, Clock, BookOpen, Award } from 'lucide-react';
import Header from '../components/common/Header';
import img1 from "../assets/banners/courses.png";
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import EnrollmentForm from '../components/EnrollmentForm';
import { CourseCardSkeleton, StatsCardSkeleton } from '../components/common/SkeletonLoader';

export default function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses`);
        if (!res.ok) {
          throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
        }
        
        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Backend server is not responding with JSON. Please ensure the backend is running.');
        }
        
        const data = await res.json();

        const flattened = data.flatMap(group =>
          group.courses.map(course => ({
            ...course,
            category: group.category
          }))
        );

        setAllCourses(flattened);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to connect to backend. Please ensure the backend server is running.');
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const categoryList = ['All', ...new Set(allCourses.map(course => course.category))];

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { icon: BookOpen, label: "Total Courses", value: `${allCourses.length}` },
    {
      icon: Users,
      label: "Active Students",
      value: allCourses.reduce((sum, course) => sum + (course.students || 0), 0).toLocaleString()
    },
    {
      icon: Star,
      label: "5-Star Reviews",
      value: allCourses.reduce((sum, course) => (course.rating >= 4.5 ? sum + 1 : sum), 0).toLocaleString()
    },
    {
      icon: Award,
      label: "Certified Instructors",
      value: "200+" // Static for now
    }
  ];

  if (loading) return <p className="text-center py-10">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  if (loading) {
    return (
      <div>
        <Header
          image={img1}
          heading="Our Courses"
          subheading="Explore our wide range of courses designed to help you achieve your goals"
        />
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          
          {/* Search and Filter Skeleton */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="w-full md:w-96 h-10 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-20 bg-gray-300 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Courses Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div>
      <Header
        image={img1}
        heading="Our Courses"
        subheading="Explore our wide range of courses designed to help you achieve your goals"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
              <stat.icon className="w-8 h-8 text-teal-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Category Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryList.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCourses.map((course, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <Link to={`/courses/${course.courseCode}`}>
                <img
                  src={course.image}
                  alt={course.courseName}
                  className="w-full h-48 object-cover cursor-pointer"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span className="font-medium text-teal-600">{course.category}</span>
                  <span>{course.level || 'Beginner'}</span>
                </div>

                <Link to={`/courses/${course.courseCode}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors cursor-pointer">
                    {course.courseName}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-4">
                  {course.subtitle || 'No description available'}
                </p>

                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {course.duration || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" /> {course.rating || '4.0'}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" /> {course.students || 0} students
                  </span>
                  <span className="text-teal-600 font-bold">
                    ₹{course.fees?.discounted?.toLocaleString() || 'Free'}
                  </span>
                </div>

                <div className="mt-auto">
                    <button 
                    onClick={() => {
                    setSelectedCourseId(course.courseCode);
                    setIsModalOpen(true);
                  }} 
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors cursor-pointer">
                      Enroll Now
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-teal-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact our team to learn more about our courses or request a custom training program for your organization.
          </p>
          <Link to="/contact">
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors cursor-pointer">
              Contact Us
            </button>
          </Link>
        </div>
      </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EnrollmentForm courseId={selectedCourseId} onClose={() => setIsModalOpen(false)} />
      </Modal>

    </div>
  );
}
