import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../../assets/logo.png'; // Adjust the path as necessary
import extendlogo from '../../assets/extendlogo.png'; // Adjust the path as necessary
import { FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <a href="/" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <img src={extendlogo} alt="Logo" className="h-10" />
                {/* <span className="ml-2 text-xl font-semibold text-teal-700">BMS Academy</span> */}
              </a>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Empowering learners worldwide with quality education and practical skills for success.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/bmsittraining?rdid=HQ8yuRR80obgw9fh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1NVxH9T2j5%2F#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-all duration-300 hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@bmsacademy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="/courses" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Our Courses</a></li>
              <li><a href="/contact" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Contact Us</a></li>
              <li><a href="/activities" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Activity</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="/terms" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="/faq" className="hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 inline-block">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-sm leading-relaxed">1st Floor, Park Plaza</li>
              <li className="text-sm leading-relaxed">BMS ACADEMY, Goner Rd</li>
              <li className="text-sm leading-relaxed">Jaipur, Rajasthan 302031</li>
              <li className="text-sm leading-relaxed">Phone: <a href="tel:9660038052" className="hover:text-teal-400 transition-colors">9660038052</a></li>
              <li className="text-sm leading-relaxed">Email: <a href="mailto:info@bmsacademy.com" className="hover:text-teal-400 transition-colors">info@bmsacademy.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} BMS Academey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;