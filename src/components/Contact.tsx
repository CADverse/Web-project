import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Toast from './Toast';
import { apiPost } from '../utils/api';
import { API_ENDPOINTS } from '../config/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    console.log('📝 Contact form submission started:', formData);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      console.log('❌ Validation failed - missing fields:', {
        hasName: !!formData.name,
        hasEmail: !!formData.email,
        hasMessage: !!formData.message
      });
      setToast({
        message: 'Please fill in all fields',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('❌ Invalid email format:', formData.email);
      setToast({
        message: 'Please enter a valid email address',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    console.log('✅ Validation passed, submitting to backend...');
    // Submit form to backend
    submitContactForm();
  };

  /**
   * Submit contact form to backend API
   * Uses the centralized API utility for consistent error handling
   */
  const submitContactForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the request payload
      // Make sure all required fields are included
      const requestPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        // Add timestamp for backend processing
        timestamp: new Date().toISOString()
      };
      
      console.log('📧 Contact form submission started:');
      console.log('📋 Form data validation:', {
        hasName: !!requestPayload.name,
        hasEmail: !!requestPayload.email,
        hasMessage: !!requestPayload.message,
        nameLength: requestPayload.name.length,
        emailLength: requestPayload.email.length,
        messageLength: requestPayload.message.length
      });
      
      console.log('📦 Request payload details:', {
        endpoint: API_ENDPOINTS.contact,
        payloadSize: JSON.stringify(requestPayload).length,
        method: 'POST',
        contentType: 'application/json'
      });
      
      // Validate payload before sending
      if (!requestPayload.name || !requestPayload.email || !requestPayload.message) {
        console.error('❌ Payload validation failed:', {
          missingName: !requestPayload.name,
          missingEmail: !requestPayload.email,
          missingMessage: !requestPayload.message
        });
        throw new Error('All fields are required');
      }
      
      console.log('🚀 Making API call to contact endpoint...');
      
      // Make API call to backend
      const response = await apiPost(API_ENDPOINTS.contact, requestPayload);
      
      console.log('📥 Contact form backend response:', {
        success: response.success,
        message: response.message,
        error: response.error,
        timestamp: new Date().toISOString()
      });
      
      // Handle successful submission
      if (response.success) {
        console.log('✅ Contact form submitted successfully:', {
          emailSentTo: 'cadverse.a@gmail.com',
          senderName: requestPayload.name,
          senderEmail: requestPayload.email,
          messageLength: requestPayload.message.length
        });
        
        setToast({
          message: response.message || 'Message sent successfully! We\'ll get back to you soon.',
          type: 'success',
          isVisible: true,
        });
        
        // Reset form on success
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Handle API response with success: false
        console.error('❌ Contact form submission failed:', {
          error: response.error,
          message: response.message,
          payload: requestPayload
        });
        setToast({
          message: response.error || 'Failed to send message. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error: any) {
      // Handle network errors, API errors, etc.
      console.error('❌ Contact form submission error:', {
        error: error,
        message: error.message,
        status: error.status,
        formData: formData
      });
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to send message';
      
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Invalid form data. Please check all fields.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to send message. Please try again.';
      }
      
      setToast({
        message: errorMessage,
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@cadverse.com',
      link: 'mailto:hello@cadverse.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Design Street, Innovation City, IC 12345',
      link: '#',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-mono">
            Ready to bring your ideas to life? Contact us today and let's discuss 
            how we can help you turn your sketches into reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-mono resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h4>
                      {info.link.startsWith('#') ? (
                        <p className="text-gray-600 dark:text-gray-400 font-mono">{info.value}</p>
                      ) : (
                        <a
                          href={info.link}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-mono transition-colors"
                        >
                          {info.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Business Hours</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monday - Friday:</span>
                  <span className="text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Saturday:</span>
                  <span className="text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunday:</span>
                  <span className="text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </section>
  );
};

export default Contact;