import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Clock, Code, Calculator, Palette, Globe, Monitor, TrendingUp } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Adjust the path as necessary
import extendlogo from '../../assets/extendlogo.png'; // Adjust the path as necessary



// Utility to slugify course names for URL
const slugify = str =>
    str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
    const [showStudentCornerDropdown, setShowStudentCornerDropdown] = useState(false);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const navigate = useNavigate();

    // Icon mapping for categories
    const categoryIcons = {
        "IT & Digital Literacy": <Monitor className="w-4 h-4" />,
        "Programming & Development": <Code className="w-4 h-4" />,
        "Accounting & Finance": <Calculator className="w-4 h-4" />,
        "Digital Marketing & Graphics": <TrendingUp className="w-4 h-4" />,
        "Design": <Palette className="w-4 h-4" />,
        "Business": <Globe className="w-4 h-4" />
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/courses`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
                }

                // Check if response is actually JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Backend server is not responding with JSON. Please ensure the backend is running.');
                }

                const data = await response.json();

                // Transform data to match the expected format
                const transformedData = data.map(category => ({
                    category: category.category,
                    icon: categoryIcons[category.category] || <BookOpen className="w-4 h-4" />,
                    courses: category.courses
                }));

                setCoursesData(transformedData);
                setCoursesLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Set empty data to prevent UI errors
                setCoursesData([]);
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);
    return (
        <>
            {/* Top Bar */}
            <div className="w-full bg-teal-700 text-white text-sm">
                <div className="max-w-9xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-y-2">

                    {/* Left side: contact and links */}
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                            <span role="img" aria-label="phone">📞</span> +91 98765 43210
                        </span>
                        <a href="/admin-login" className="hover:underline">Login</a>
                        <a href="/dashboard" className="hover:underline">Dashboard</a>
                    </div>

                    {/* Right side: social icons */}
                    <div className="flex items-center gap-3">
                        <a href="https://www.facebook.com/bmsittraining?rdid=HQ8yuRR80obgw9fh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1NVxH9T2j5%2F#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.youtube.com/@bmsacademy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Sticky Navbar */}
            <nav className={`sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${scrolled ? 'bg-white/95 shadow-lg border-b border-gray-100' : 'bg-white/90'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="flex items-center justify-between h-18">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/" className="flex items-center">
                                <img src={logo} alt="Logo" className="h-10 w-10" />
                                <img src={extendlogo} alt="Logo" className="h-10" />
                                {/* <span className="ml-2 text-xl font-semibold text-teal-700">BMS Academy</span> */}
                            </a>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-1">
                                <a href="/" className="text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-teal-50">Home</a>

                                {/* Enhanced Courses Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => {
                                        if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                        setShowCoursesDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        const timeout = setTimeout(() => {
                                            setShowCoursesDropdown(false);
                                        }, 200);
                                        setDropdownTimeout(timeout);
                                    }}
                                >
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="text-gray-700 cursor-pointer hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center focus:outline-none transition-all duration-200 hover:bg-teal-50">
                                        Courses
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>

                                    {showCoursesDropdown && (
                                        <div
                                            className="absolute left-1/2 top-full mt-3 transform -translate-x-1/2 w-[90vw] max-w-6xl bg-white rounded-2xl shadow-2xl z-50 p-0 flex border border-gray-100 overflow-hidden backdrop-blur-lg"
                                            onMouseEnter={() => {
                                                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                                setShowCoursesDropdown(true);
                                            }}
                                            onMouseLeave={() => {
                                                const timeout = setTimeout(() => {
                                                    setShowCoursesDropdown(false);
                                                }, 200);
                                                setDropdownTimeout(timeout);
                                            }}
                                        >
                                            {/* Sidebar - Categories */}
                                            <div className="w-2/5 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
                                                <div className="p-6 border-b border-gray-200 bg-white">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-teal-600" />
                                                        Course Categories
                                                    </h3>
                                                </div>
                                                <div className="p-2">
                                                    {coursesLoading ? (
                                                        <div className="space-y-2">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <ul className="space-y-1">
                                                            {coursesData.map((cat, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                                                                    className={`group cursor-pointer transition-all duration-200 ease-in-out rounded-lg ${activeCategoryIndex === idx
                                                                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md transform scale-[1.02]'
                                                                        : 'text-slate-700 hover:bg-white hover:shadow-sm'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between px-4 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`transition-colors duration-200 ${activeCategoryIndex === idx ? 'text-white' : 'text-teal-600'
                                                                                }`}>
                                                                                {cat.icon}
                                                                            </div>
                                                                            <span className="font-medium text-sm">{cat.category}</span>
                                                                        </div>
                                                                        <ChevronRight className={`w-4 h-4 transition-all duration-200 ${activeCategoryIndex === idx
                                                                            ? 'text-white transform rotate-90'
                                                                            : 'text-slate-400 group-hover:text-slate-600'
                                                                            }`} />
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Panel - Courses */}
                                            <div className="w-3/5 bg-white">
                                                {coursesLoading ? (
                                                    <div className="p-4">
                                                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                                                        <div className="space-y-3">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : coursesData[activeCategoryIndex] && (
                                                    <>
                                                        {/* Header */}
                                                        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="text-orange-600">
                                                                    {coursesData[activeCategoryIndex].icon}
                                                                </div>
                                                                <h4 className="text-lg font-bold text-orange-700">
                                                                    {coursesData[activeCategoryIndex].category}
                                                                </h4>
                                                            </div>
                                                            <p className="text-sm text-orange-600">
                                                                {coursesData[activeCategoryIndex].courses.length} courses available
                                                            </p>
                                                        </div>

                                                        {/* Courses List */}
                                                        <div className="p-4 max-h-96 overflow-y-auto">
                                                            <ul className="space-y-3">
                                                                {coursesData[activeCategoryIndex].courses.map((course, i) => (
                                                                    <li
                                                                        key={i}
                                                                        onMouseEnter={() => setHoveredCourse(i)}
                                                                        onMouseLeave={() => setHoveredCourse(null)}
                                                                        className="group"
                                                                    >
                                                                        <a
                                                                            href={`/courses/${(course.courseCode)}`}
                                                                            className={`block p-3 rounded-lg border transition-all duration-200 ${hoveredCourse === i
                                                                                ? 'border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md transform translate-x-1'
                                                                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                    <h5 className={`font-semibold text-sm transition-colors duration-200 ${hoveredCourse === i ? 'text-teal-700' : 'text-slate-800 group-hover:text-teal-600'
                                                                                        }`}>
                                                                                        {course.courseName}
                                                                                    </h5>
                                                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                                        {course.details}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Users className="w-3 h-3" />
                                                                                            {course.students?.toLocaleString() || 'N/A'} students
                                                                                        </span>
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Clock className="w-3 h-3" />
                                                                                            {course.duration}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${hoveredCourse === i
                                                                                    ? 'text-teal-600 transform translate-x-1'
                                                                                    : 'text-slate-400 group-hover:text-slate-600'
                                                                                    }`} />
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <a href="/about" className="text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-teal-50">About</a>
                                <a href="/contact" className="text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-teal-50">Contact</a>

                                {/* Enhanced Courses Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => {
                                        if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                        setShowStudentCornerDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        const timeout = setTimeout(() => {
                                            setShowStudentCornerDropdown(false);
                                        }, 200);
                                        setDropdownTimeout(timeout);
                                    }}
                                >
                                    <button className="text-gray-700 cursor-pointer hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center focus:outline-none transition-all duration-200 hover:bg-teal-50">
                                        Student Corner
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>

                                    {showStudentCornerDropdown && (
                                        <div
                                            className="absolute left-1/2 top-full mt-4 transform -translate-x-1/2 z-50"
                                            onMouseEnter={() => {
                                                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                                setShowStudentCornerDropdown(true);
                                            }}
                                            onMouseLeave={() => {
                                                const timeout = setTimeout(() => {
                                                    setShowStudentCornerDropdown(false);
                                                }, 200);
                                                setDropdownTimeout(timeout);
                                            }}
                                        >
                                            {/* Arrow */}
                                            <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200 z-[-1]" />

                                            {/* Dropdown Box */}
                                            <div className="w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-lg">
                                                <ul className="divide-y divide-gray-200">
                                                    <li>
                                                        <a
                                                            href="/certificate-verification"
                                                            className="block px-6 py-4 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 font-medium"
                                                        >
                                                            🎓 Certificate Verification
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="/offers-and-schemes"
                                                            className="block px-6 py-4 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 font-medium"
                                                        >
                                                            💡 Offers and Schemes
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <a href="/activities" className="text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-teal-50">Activities</a>


                            </div>



                        </div>


                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-teal-600 hover:text-teal-800 hover:bg-teal-100 focus:outline-none">
                                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {/* Mobile Menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                        <a href="/" className="text-teal-600 hover:bg-teal-50 block px-3 py-2 rounded-md text-base font-medium">Home</a>

                        {/* Mobile Courses Dropdown */}
                        <div className="relative">
                            <button

                                className="w-full flex justify-between items-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium"
                            >
                                <a href='/courses'>Courses</a>
                                <ChevronDown onClick={() => setShowCoursesDropdown(!showCoursesDropdown)} size={18} className={`transition-transform ${showCoursesDropdown ? 'transform rotate-180' : ''}`} />
                            </button>

                            {showCoursesDropdown && (
                                coursesLoading ? (
                                    <div className="pl-4 mt-1 space-y-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="pl-4 mt-1 space-y-1">
                                        {coursesData.map((cat, idx) => (
                                            <div key={idx} className="border-l-2 border-teal-200 pl-3">
                                                <button
                                                    onClick={() => setActiveCategoryIndex(activeCategoryIndex === idx ? null : idx)}
                                                    className="w-full flex justify-between items-center text-gray-600 hover:text-teal-600 px-2 py-1 rounded-md text-sm font-medium"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-teal-600">
                                                            {cat.icon}
                                                        </div>
                                                        {cat.category}
                                                    </div>
                                                    <ChevronDown size={16} className={`transition-transform ${activeCategoryIndex === idx ? 'transform rotate-180' : ''}`} />
                                                </button>

                                                {activeCategoryIndex === idx && (
                                                    <div className="pl-2 mt-1 space-y-1">
                                                        {cat.courses.map((course, i) => (
                                                            <a
                                                                key={i}
                                                                href={`/courses/${(course.courseCode)}`}
                                                                className="block px-2 py-1.5 text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-md text-sm"
                                                            >
                                                                {course.courseName}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>

                        <a href="/about" className="text-gray-600 hover:bg-teal-50 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">About</a>
                        <a href="/contact" className="text-gray-600 hover:bg-teal-50 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Contact</a>

                        {/* Mobile Student Corner Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowStudentCornerDropdown(!showStudentCornerDropdown)}
                                className="w-full flex justify-between items-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium"
                            >
                                Student Corner
                                <ChevronDown size={18} className={`transition-transform ${showStudentCornerDropdown ? 'transform rotate-180' : ''}`} />
                            </button>

                            {showStudentCornerDropdown && (
                                <div className="pl-4 mt-1 space-y-1">
                                    <a
                                        href="/certificate-verification"
                                        className="block px-3 py-2 text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-md text-sm"
                                    >
                                        🎓 Certificate Verification
                                    </a>
                                    <a
                                        href="/offers-and-schemes"
                                        className="block px-3 py-2 text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-md text-sm"
                                    >
                                        💡 Offers and Schemes
                                    </a>
                                </div>
                            )}
                        </div>

                        <a href="/activities" className="text-gray-600 hover:bg-teal-50 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Activities</a>

                        <div className="border-t border-gray-200 pt-4 pb-2">
                            {isLoggedIn ? (
                                <>
                                    <a href="/dashboard" className="flex items-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium">
                                        <User size={18} className="mr-2" />
                                        Dashboard
                                    </a>
                                    <button onClick={toggleLogin} className="flex w-full items-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium">
                                        <LogOut size={18} className="mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="block text-gray-600 hover:bg-teal-50 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium">LOG IN</a>
                                    <a href="/dashboard" className="block bg-teal-600 hover:bg-teal-700 text-white mt-2 px-3 py-2 rounded-md text-base font-medium text-center">Dashboard</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;