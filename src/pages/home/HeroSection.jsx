// HeroSection.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const images = [
  "https://res.cloudinary.com/dsol90tiu/image/upload/v1748724705/image_5_ydnihy.jpg",
  "https://res.cloudinary.com/dsol90tiu/image/upload/v1748724705/image_4_mjsruo.jpg",
  "https://res.cloudinary.com/dsol90tiu/image/upload/v1748724705/image_5_ydnihy.jpg"
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[4/5.5] sm:aspect-[4/2.7] lg:aspect-[4/1.5] overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>

      {/* Text Content */}
      <div className="absolute z-20 inset-0 flex flex-col items-center justify-center px-4 text-center text-white max-w-5xl mx-auto">
        
        <div className="text-orange-400 font-medium mb-4 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <span className="text-lg">🚀</span>
          <span>Empower Your Learning Journey Today</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Unlock Your Potential
        </h1>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-200 font-semibold mb-6">
          with Expert-Led Courses
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 px-2 sm:px-8 max-w-3xl leading-relaxed">
          Hands-on training and certifications to help you get the most from Geeks Learning.
        </p>

        <ul className="mb-8 text-white flex flex-col sm:flex-row gap-3 sm:gap-8 text-sm sm:text-base items-center sm:justify-center">
          <li className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg">
            <span className="text-green-400">✅</span> Expert Instructors
          </li>
          <li className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg">
            <span className="text-green-400">✅</span> Flexible Learning
          </li>
          <li className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg">
            <span className="text-green-400">✅</span> Supportive Community
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold py-3 px-8 rounded-xl text-sm sm:text-base cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
      Contact Now
    </button>
  </Link>
  
  <Link to="/courses">
    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl border border-white/30 text-sm sm:text-base cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
      Explore Courses
    </button>
  </Link>
        </div>
      </div>

      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
              current === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
