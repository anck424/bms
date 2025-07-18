import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import banner from '../assets/banners/contact.jpg';
import Header from '../components/common/Header';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Simply browse our courses, select the one you're interested in, and click the 'Enroll Now' button. Follow the checkout process to complete your enrollment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our courses if you're not completely satisfied with your purchase."
    },
    {
      question: "How do I access my courses?",
      answer: "After enrollment, you can access your courses through your student dashboard. Simply log in to your account to start learning."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        success: false,
        message: 'Please enter a valid email address'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ 
          success: true, 
          message: 'Message sent successfully! We will get back to you soon.' 
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || data.message || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'An error occurred while sending your message. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header 
        image={banner}
        heading="Contact Us"
        subheading="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Visit Us</h3>
            <p className="text-gray-600 leading-relaxed">1st Floor, Park Plaza, BMS ACADEMY, Goner Rd, Jaipur, Rajasthan 302031</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Call Us</h3>
            <p className="text-gray-600">
              <a href="tel:9660038052" className="hover:text-teal-600 transition-colors">9660038052</a>
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Email Us</h3>
            <p className="text-gray-600">
              <a href="mailto:info@bmsacademy.com" className="hover:text-teal-600 transition-colors">info@bmsacademy.com</a>
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Working Hours</h3>
            <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-xl ${
                submitStatus.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                } rounded-xl font-semibold`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                    </div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed ml-11">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Location</h2>
          <div className="bg-gray-200 h-96 rounded-2xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1141.7173914621787!2d75.89154905712184!3d26.867224599445578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db7a6349b51f7%3A0xd34e4be877b4c853!2sBMS%20ACADEMY!5e0!3m2!1sen!2sin!4v1749578480427!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Our Location"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}