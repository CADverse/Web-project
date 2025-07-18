import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Printer, BarChart3 } from 'lucide-react';
import ServiceCard from './ServiceCard';
import Toast from './Toast';

const Services: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });

  const services = [
    {
      id: 1,
      title: '2D Rough Sketch to 3D Modeling',
      description: 'Transform your hand-drawn sketches into precise 3D models with professional accuracy and attention to detail.',
      icon: <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      hasUpload: true,
      acceptedFiles: '.png,.jpg,.jpeg,.pdf',
      hasContactButton: false,
    },
    {
      id: 2,
      title: '3D Printing Service',
      description: 'High-quality 3D printing services for rapid prototyping and production-ready parts using advanced materials.',
      icon: <Printer className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      hasUpload: true,
      acceptedFiles: '.stl,.obj',
      hasContactButton: false,
    },
    {
      id: 3,
      title: '3D Modeling & Simulation Report',
      description: 'Comprehensive analysis and simulation reports with detailed visualizations and performance metrics.',
      icon: <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      hasUpload: false,
      hasContactButton: true,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleFileUpload = (file: File, serviceTitle: string) => {
    // Handle file upload results from ServiceCard
    // Check if this is an error file (created by ServiceCard for error handling)
    if (file.type === 'error') {
      setToast({
        message: (file as any).error || 'Upload failed',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    // Handle successful file selection
    // Handle file upload results from ServiceCard
    // Check if this is an error file (created by ServiceCard for error handling)
    if (file.type === 'error') {
      setToast({
        message: (file as any).error || 'Upload failed',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    // Handle successful file selection
    setToast({
      message: `File "${file.name}" selected for ${serviceTitle}`,
      type: 'success',
      isVisible: true,
    });
  };

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-mono">
            From concept to creation, we offer comprehensive services to bring 
            your ideas to life with precision and innovation.
          </p>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              hasUpload={service.hasUpload}
              acceptedFiles={service.acceptedFiles}
              onFileUpload={(file) => handleFileUpload(file, service.title)}
              isActive={false}
              hasContactButton={service.hasContactButton}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {services.map((service, index) => (
                <div key={service.id} className="w-full flex-shrink-0 px-4">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    hasUpload={service.hasUpload}
                    acceptedFiles={service.acceptedFiles}
                    onFileUpload={(file) => handleFileUpload(file, service.title)}
                    isActive={index === currentSlide}
                    hasContactButton={service.hasContactButton}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
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

export default Services;