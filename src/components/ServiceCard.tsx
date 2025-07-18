import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Printer, BarChart3, CheckCircle, MessageCircle } from 'lucide-react';
import { apiPostFormData } from '../utils/api';
import { API_ENDPOINTS, SERVICE_TYPE_MAPPING } from '../config/api';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  hasUpload?: boolean;
  acceptedFiles?: string;
  onFileUpload?: (file: File) => void;
  isActive: boolean;
  hasContactButton?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  hasUpload,
  acceptedFiles,
  onFileUpload,
  isActive,
  hasContactButton,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleSubmit = () => {
    if (!uploadedFile || isSubmitting) return;
    
    submitFileToBackend(uploadedFile);
  };

  /**
   * Submit uploaded file to backend API
   * Handles the complete file upload process with proper error handling
   */
  const submitFileToBackend = async (file: File) => {
    if (!file) return;
    
    setIsSubmitting(true);
    
    try {
      // Determine service type based on title
      const serviceType = SERVICE_TYPE_MAPPING[title as keyof typeof SERVICE_TYPE_MAPPING];
      
      if (!serviceType) {
        throw new Error(`Invalid service type: ${title}`);
      }
      
      console.log(`📁 Starting file upload process:`);
      console.log(`🎯 Service mapping:`, {
        frontendTitle: title,
        backendServiceType: serviceType,
        expectedGoogleDriveFolder: serviceType === '2d-to-3d' 
          ? 'Uploaded Projects/2D to 3D sketches' 
          : 'Uploaded Projects/3D Printing Services'
      });
      
      console.log(`📄 File upload details:`, {
        name: file.name,
        size: file.size,
        sizeInMB: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        mimeType: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Create FormData for file upload
      // This ensures proper multipart/form-data encoding
      const formData = new FormData();
      formData.append('file', file);
      
      // Additional debugging for FormData
      console.log('📦 FormData preparation:', {
        hasFile: formData.has('file'),
        formDataEntries: Array.from(formData.entries()).length,
        targetEndpoint: API_ENDPOINTS.upload(serviceType),
        httpMethod: 'POST'
      });
      
      // Make API call to upload endpoint
      // Uses the correct endpoint format: /api/upload/{serviceType}
      console.log(`🚀 Making API call to: ${API_ENDPOINTS.upload(serviceType)}`);
      
      const response = await apiPostFormData(
        API_ENDPOINTS.upload(serviceType),
        formData
      );
      
      console.log('📥 Backend upload response:', {
        success: response.success,
        message: response.message,
        fileName: response.fileName,
        fileId: response.fileId,
        serviceType: response.serviceType
      });
      
      // Handle successful upload
      if (response.success) {
        setUploadSuccess(true);
        console.log('✅ File upload completed successfully:', {
          fileName: response.fileName || file.name,
          backendServiceType: serviceType,
          googleDriveFileId: response.fileId,
          uploadedToFolder: serviceType === '2d-to-3d' 
            ? 'Uploaded Projects/2D to 3D sketches' 
            : 'Uploaded Projects/3D Printing Services'
        });
        
        // Show success message via parent component if available
        if (onFileUpload) {
          onFileUpload(file);
        }
      } else {
        throw new Error(response.error || response.message || 'Upload failed - no error details provided');
      }
    } catch (error: any) {
      console.error('❌ File upload failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Upload failed';
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Invalid file or request format';
      } else if (error.status === 413) {
        errorMessage = 'File is too large. Maximum size is 10MB.';
      } else if (error.status === 415) {
        errorMessage = 'Unsupported file type for this service.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Reset upload state on error
      console.log('🔄 Resetting upload state due to error:', {
        originalFile: file.name,
        errorMessage: errorMessage,
        errorStatus: error.status
      });
      
      setUploadedFile(null);
      setUploadSuccess(false);
      
      // Show error message via parent component if available
      if (onFileUpload) {
        // Create a mock file with error info for parent to handle
        const errorFile = new File([''], 'error', { type: 'error' });
        (errorFile as any).error = errorMessage;
        onFileUpload(errorFile);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle file selection and basic validation
   */
  const processSelectedFile = (file: File) => {
    // Reset previous states
    setUploadSuccess(false);
    
    console.log('📁 Processing selected file:', {
      name: file.name,
      size: file.size,
      sizeInMB: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      maxAllowedSize: '10 MB',
      isWithinLimit: file.size <= (10 * 1024 * 1024)
    });
    
    // File size validation - 10MB limit
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File size validation failed:', {
        fileSize: file.size,
        fileName: file.name,
        maxSize: maxSize,
        fileSizeInMB: (file.size / 1024 / 1024).toFixed(2),
        maxSizeInMB: (maxSize / 1024 / 1024).toFixed(2),
        exceedsLimit: file.size > maxSize
      });
      if (onFileUpload) {
        const errorFile = new File([''], 'error', { type: 'error' });
        (errorFile as any).error = `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit`;
        onFileUpload(errorFile);
      }
      return;
    }
    
    console.log('✅ File size validation passed:', {
      fileName: file.name,
      actualSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      limit: '10 MB'
    });
    
    // Validate file type based on service
    const allowedTypes = {
      '2D Rough Sketch to 3D Modeling': ['.png', '.jpg', '.jpeg', '.pdf'],
      '3D Printing Service': ['.stl', '.obj']
    };
    
    const serviceTypes = allowedTypes[title as keyof typeof allowedTypes];
    if (serviceTypes) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      console.log('🔍 File type validation check:', {
        fileName: file.name,
        detectedExtension: fileExtension,
        allowedTypes: serviceTypes,
        serviceTitle: title
      });
      
      if (!serviceTypes.includes(fileExtension)) {
        console.error('❌ File type validation failed:', fileExtension);
        if (onFileUpload) {
          const errorFile = new File([''], 'error', { type: 'error' });
          (errorFile as any).error = `Invalid file type. Accepted: ${serviceTypes.join(', ')}`;
          onFileUpload(errorFile);
        }
        return;
      }
    }
    
    console.log('✅ File type validation passed:', {
      fileName: file.name,
      fileType: file.type
    });
    
    // File is valid, set it for upload
    setUploadedFile(file);
    console.log('✅ File selected successfully:', {
      name: file.name,
      sizeBytes: file.size,
      sizeMB: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      mimeType: file.type,
      fileExtension: '.' + file.name.split('.').pop()?.toLowerCase(),
      serviceType: title
    });
  };
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-900 rounded-lg p-8 sketch-shadow dark:sketch-shadow-dark hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col ${
        isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 font-mono">{description}</p>
      </div>

      <div className="flex-grow">
        {hasUpload && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : uploadSuccess
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                  : uploadedFile
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadSuccess ? (
                <div className="space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    File uploaded successfully!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {uploadedFile?.name}
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop your files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Supports: {acceptedFiles}
                  </p>
                </div>
              )}
            </div>

            {uploadSuccess ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept={acceptedFiles}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    Upload Another File
                  </button>
                </div>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept={acceptedFiles}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    Upload Another File
                  </button>
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept={acceptedFiles}
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Choose Files
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {hasContactButton && (
        <div className="mt-6">
          <button
            onClick={scrollToContact}
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Us
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCard;