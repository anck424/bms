import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AvatarGroup from '../../components/AvatarGroup';
import Modal from '../../components/Modal';
import EnrollmentForm from '../../components/EnrollmentForm';
import { PopularCourseCardSkeleton } from '../../components/common/SkeletonLoader';


const PopularCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);


  const [selectedCategory, setSelectedCategory] = useState('All Programmes');


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


        // Assuming your backend returns an array of categories with courses:
        // e.g. [{ category: 'Design', courses: [...] }, ...]
        // Flatten courses and attach category as in your original code:
        const flattened = data.flatMap(category =>
          category.courses.map(course => ({
            ...course,
            category: category.category,
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


  // Extract unique categories from fetched data
  const categoryList = ['All Programmes', ...new Set(allCourses.map(c => c.category))];


  // Filter courses by category
  const filteredCourses = selectedCategory === 'All Programmes'
    ? allCourses
    : allCourses.filter(course => course.category === selectedCategory);


  // Sort by popularity and slice top 4
  const popularCourses = filteredCourses.sort((a, b) => b.students - a.students).slice(0, 4);


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Title */}
        <div className="text-center mb-8 relative">
          <h2 className="text-4xl font-bold text-orange-500">Popular Courses</h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-400 rounded-full"></div>
        </div>

        {/* Category Buttons Skeleton */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-300 rounded-md animate-pulse"></div>
          ))}
        </div>

        {/* Course Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <PopularCourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-8 relative">
        <h2 className="text-4xl font-bold text-orange-500">Popular Courses</h2>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-400 rounded-full"></div>
      </div>


      {/* Dynamic Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categoryList.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-teal-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {category}
          </button>
        ))}
      </div>


      {/* Popular Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularCourses.map((course, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <Link to={`/courses/${course.courseCode}`} className="h-48 bg-gray-200">
              <img src={course.image} alt={course.courseName} className="w-full h-full object-cover" />
            </Link>


            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <AvatarGroup />
                <div className="text-sm text-gray-500">+ {course.students} students</div>
              </div>


              <div className="text-sm text-gray-500 mb-1">{course.duration}</div>
              <Link to={`/courses/${course.courseCode}`} className="text-lg font-bold text-teal-700 mb-2 hover:underline">
                {course.courseName}
              </Link>


              <p className="text-xs text-gray-600 mb-4">{course.details}</p>


              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-end">
                  {course.fees && typeof course.fees.discounted === 'number' ? (
                    course.fees.original !== course.fees.discounted ? (
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">
                          {course.fees.currency} {course.fees.original?.toLocaleString()}
                        </div>
                        <div className="text-xl font-bold text-orange-500">
                          {course.fees.currency} {course.fees.discounted.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-orange-500">
                        {course.fees.currency} {course.fees.original?.toLocaleString()}
                      </span>
                    )
                  ) : (
                    <span className="text-sm text-gray-400 italic">Fee info unavailable</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedCourseId(course.courseCode);
                    setIsModalOpen(true);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded cursor-pointer transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EnrollmentForm courseId={selectedCourseId} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};


export default PopularCourses;
