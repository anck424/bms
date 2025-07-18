import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, DollarSign, Award, CheckCircle, Star, Calendar, BookOpen, Target, Trophy } from 'lucide-react';
import { CourseDetailSkeleton } from '../components/common/SkeletonLoader';

const CourseDetailPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses/${courseId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch course data: ${res.statusText}`);
                }
                
                // Check if response is actually JSON
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Backend server is not responding with JSON. Please ensure the backend is running.');
                }
                
                return res.json();
            })
            .then(data => {
                setCourseData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching course data:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [courseId]);

    if (loading) {
        return <CourseDetailSkeleton />;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
            Error: {error}
        </div>;
    }

    if (!courseData) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            Course not found
        </div>;
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'syllabus', label: 'Syllabus', icon: Target },
        { id: 'certificate', label: 'Certificate', icon: Award }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <img
                    src={courseData.banner}
                    alt="Course Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl text-white">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">{courseData.title}</h1>
                            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90 line-clamp-2">{courseData.subtitle}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1" />
                                    <span>{courseData.rating} ({courseData.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                    <span>
                                        {typeof courseData.totalStudents === 'number'
                                            ? courseData.totalStudents.toLocaleString()
                                            : 'N/A'} students
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                    <span>{courseData.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Navigation Tabs - Horizontal on desktop, vertical on mobile */}
                        <div className="flex flex-col sm:flex-row sm:space-x-1 space-y-1 sm:space-y-0 mb-6 sm:mb-8 bg-white rounded-lg p-1 shadow-sm">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 rounded-md transition-all ${activeTab === tab.id
                                            ? 'bg-teal-700 hover:bg-green-700 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        <span className="text-sm sm:text-base">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Course Description */}
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Course Description</h2>
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{courseData.description}</p>
                                </div>

                                {/* Eligibility */}
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Eligibility Requirements</h2>
                                    <ul className="space-y-2">
                                        {courseData.eligibility.map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm sm:text-base">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Skills */}
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Skills You Will Learn</h2>
                                    <ul className="space-y-2">
                                        {courseData.skills.map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm sm:text-base">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* How it Helps */}
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">How This Course Helps You</h2>
                                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                        {courseData.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-start">
                                                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'syllabus' && (
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Course Syllabus</h2>
                                <div className="space-y-4 sm:space-y-6">
                                    {courseData.syllabus.map((module, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{module.module}</h3>
                                                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                                                    {module.duration}
                                                </span>
                                            </div>
                                            <ul className="space-y-1 sm:space-y-2">
                                                {module.topics.map((topic, topicIndex) => (
                                                    <li key={topicIndex} className="text-gray-600 flex items-center text-sm sm:text-base">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300 rounded-full mr-2 sm:mr-3"></div>
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'certificate' && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Certificate of Completion</h2>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <img
                                                src={courseData.certificate.image}
                                                alt="Certificate Sample"
                                                className="w-full rounded-lg shadow-md"
                                            />
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Certification Criteria</h3>
                                            <ul className="space-y-2 sm:space-y-3">
                                                {courseData.certificate.criteria.map((criteria, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm sm:text-base">{criteria}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Stacks below main content on mobile */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-4 sm:space-y-6">
                            {/* Pricing Card */}
                            <div className="bg-green-50 rounded-lg p-4 sm:p-6 shadow-sm border">
                                <div className="text-center mb-4 sm:mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 mb-2">
                                        <span className="text-2xl sm:text-3xl font-bold text-green-600">
                                            {courseData.fees.currency}{courseData.fees.discounted}
                                        </span>
                                        <span className="text-base sm:text-lg text-gray-500 line-through">
                                            {courseData.fees.currency}{courseData.fees.original}
                                        </span>
                                    </div>
                                    <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                        33% OFF Limited Time
                                    </span>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition mb-3 sm:mb-4 text-sm sm:text-base">
                                    Enroll Now
                                </button>

                                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        <span>Starts: Next Monday</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        <span>Duration: {courseData.duration}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        <span>
                                            {typeof courseData.totalStudents === 'number'
                                                ? courseData.totalStudents.toLocaleString()
                                                : 'N/A'} enrolled
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Course Features */}
                            <div className="bg-green-50 rounded-lg p-4 sm:p-6 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">What's Included</h3>
                                <ul className="space-y-2 sm:space-y-3">
                                    {courseData.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3" />
                                            <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                                <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 sm:mb-3">Quick Actions</h3>
                                <a
                                    href={courseData.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition text-sm sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-4.586-2.65A1 1 0 009 9.368v5.264a1 1 0 001.166.984l4.586-2.65a1 1 0 000-1.768z" />
                                    </svg>
                                    Preview Course
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;