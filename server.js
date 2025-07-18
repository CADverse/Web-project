const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS Configuration =====
// Allow requests from your frontend domain
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://your-frontend-domain.com', // Add your actual frontend domain
    /\.netlify\.app$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// ===== Middleware Configuration =====
app.use(express.json({ limit: '15mb' })); // Increased limit for JSON
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ===== Multer Configuration (FIXED FILE SIZE VALIDATION) =====
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB in bytes (CORRECT CALCULATION)
    fieldSize: 10 * 1024 * 1024, // 10MB for fields
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 File validation check:', {
      originalName: file.originalname,
      mimeType: file.mimetype,
      fieldName: file.fieldname,
      serviceType: req.params.serviceType
    });

    // Allow specific file types based on service
    const allowedTypes = {
      '2d-to-3d': ['.png', '.jpg', '.jpeg', '.pdf'],
      '3d-printing': ['.stl', '.obj']
    };
    
    const serviceType = req.params.serviceType;
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    console.log('📋 File type validation:', {
      serviceType,
      fileExtension: fileExt,
      allowedForService: allowedTypes[serviceType]
    });
    
    if (serviceType === '2d-to-3d' && allowedTypes['2d-to-3d'].includes(fileExt)) {
      console.log('✅ File type approved for 2D to 3D service');
      cb(null, true);
    } else if (serviceType === '3d-printing' && allowedTypes['3d-printing'].includes(fileExt)) {
      console.log('✅ File type approved for 3D printing service');
      cb(null, true);
    } else {
      console.log('❌ File type rejected:', fileExt);
      cb(new Error(`Invalid file type ${fileExt} for service ${serviceType}`), false);
    }
  }
});

// ===== Google Drive Configuration =====
const GOOGLE_DRIVE_FOLDERS = {
  '2d-to-3d': '1sRY8_mTxnehIlRc8vwdnzAlomnzqO5nm', // Your actual folder ID
  '3d-printing': '1WWGY6EWoAjJaOzPWZNE9NDj8Rm0JUO3T' // Your actual folder ID
};

// Initialize Google Drive API
let drive;
try {
  const auth = new google.auth.GoogleAuth({
    keyFile: './cadverseuploader-e5acf002ba30.json',
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
  drive = google.drive({ version: 'v3', auth });
  console.log('✅ Google Drive API initialized successfully');
} catch (error) {
  console.error('❌ Google Drive API initialization failed:', error);
}

// ===== Gmail Configuration =====
let transporter;
try {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  console.log('✅ Gmail transporter initialized successfully');
} catch (error) {
  console.error('❌ Gmail transporter initialization failed:', error);
}

// ===== Helper Functions =====

// Upload file to Google Drive
async function uploadToGoogleDrive(filePath, fileName, folderId) {
  try {
    console.log('📤 Starting Google Drive upload:', {
      filePath,
      fileName,
      folderId,
      fileExists: fs.existsSync(filePath)
    });

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,webViewLink'
    });

    console.log('✅ Google Drive upload successful:', {
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink
    });

    return {
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink
    };
  } catch (error) {
    console.error('❌ Google Drive upload failed:', error);
    throw error;
  }
}

// Clean up temporary files
function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temporary file cleaned up:', filePath);
    }
  } catch (error) {
    console.error('❌ Error cleaning up temp file:', error);
  }
}

// Send email notification
async function sendEmailNotification(type, data) {
  try {
    let subject, htmlContent, textContent;

    if (type === 'file_upload') {
      subject = `New File Upload - ${data.serviceType}`;
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New File Upload Notification
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Service Details:</h3>
            <p><strong>Service Type:</strong> ${data.serviceType}</p>
            <p><strong>File Name:</strong> ${data.fileName}</p>
            <p><strong>File Size:</strong> ${data.fileSize}</p>
            <p><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          ${data.webViewLink ? `
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">📁 Google Drive Link:</h3>
            <p><a href="${data.webViewLink}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${data.webViewLink}</a></p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              This notification was sent from the CADverse file upload system.
            </p>
          </div>
        </div>
      `;

      textContent = `
New File Upload Notification

Service Type: ${data.serviceType}
File Name: ${data.fileName}
File Size: ${data.fileSize}
Upload Time: ${new Date().toLocaleString()}

${data.webViewLink ? `Google Drive Link: ${data.webViewLink}` : ''}

This notification was sent from the CADverse file upload system.
      `;
    } else if (type === 'contact_form') {
      subject = `New Contact Form Submission from ${data.name}`;
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
            ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
            <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              This message was sent from the CADverse website contact form.
            </p>
          </div>
        </div>
      `;

      textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}` : ''}
Submission Time: ${new Date().toLocaleString()}

Message:
${data.message}

This message was sent from the CADverse website contact form.
      `;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'cadverse.a@gmail.com',
      replyTo: data.email || process.env.GMAIL_USER,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

// ===== API ENDPOINTS =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'CADverse backend is running successfully'
  });
});

// File upload endpoint (FIXED)
app.post('/api/upload/:serviceType', upload.single('file'), async (req, res) => {
  console.log('📁 File upload request received:', {
    serviceType: req.params.serviceType,
    hasFile: !!req.file,
    fileDetails: req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      sizeInMB: (req.file.size / 1024 / 1024).toFixed(2),
      mimetype: req.file.mimetype
    } : null
  });

  try {
    const { serviceType } = req.params;
    const file = req.file;

    // Validate file exists
    if (!file) {
      console.log('❌ No file in request');
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    // Validate service type
    if (!GOOGLE_DRIVE_FOLDERS[serviceType]) {
      console.log('❌ Invalid service type:', serviceType);
      cleanupTempFile(file.path);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid service type' 
      });
    }

    // File size validation (FIXED - should not trigger for 117KB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.log('❌ File too large:', {
        fileSize: file.size,
        maxSize: maxSize,
        fileSizeInMB: (file.size / 1024 / 1024).toFixed(2)
      });
      cleanupTempFile(file.path);
      return res.status(400).json({ 
        success: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit` 
      });
    }

    console.log('✅ File validation passed:', {
      fileName: file.originalname,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      serviceType: serviceType
    });

    // Upload to Google Drive
    const folderId = GOOGLE_DRIVE_FOLDERS[serviceType];
    const driveResult = await uploadToGoogleDrive(
      file.path,
      file.originalname,
      folderId
    );

    // Send email notification
    await sendEmailNotification('file_upload', {
      serviceType: serviceType === '2d-to-3d' ? '2D Rough Sketch to 3D Modeling' : '3D Printing Service',
      fileName: file.originalname,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      webViewLink: driveResult.webViewLink
    });

    // Clean up temporary file
    cleanupTempFile(file.path);

    console.log('✅ File upload completed successfully');

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileId: driveResult.fileId,
      fileName: file.originalname,
      serviceType: serviceType,
      webViewLink: driveResult.webViewLink
    });

  } catch (error) {
    console.error('❌ File upload error:', error);
    
    // Clean up temporary file in case of error
    if (req.file) {
      cleanupTempFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      message: error.message
    });
  }
});

// Contact form endpoint (FIXED)
app.post('/api/contact', async (req, res) => {
  console.log('📬 Contact form request received:', {
    body: req.body,
    contentType: req.headers['content-type'],
    bodyKeys: Object.keys(req.body || {}),
    hasName: !!req.body?.name,
    hasEmail: !!req.body?.email,
    hasMessage: !!req.body?.message
  });

  try {
    const { name, email, subject, message } = req.body;

    // Enhanced validation with detailed logging
    const validation = {
      hasName: !!name && name.trim().length > 0,
      hasEmail: !!email && email.trim().length > 0,
      hasMessage: !!message && message.trim().length > 0,
      nameLength: name ? name.trim().length : 0,
      emailLength: email ? email.trim().length : 0,
      messageLength: message ? message.trim().length : 0
    };

    console.log('📋 Contact form validation:', validation);

    // Check required fields
    if (!validation.hasName || !validation.hasEmail || !validation.hasMessage) {
      console.log('❌ Missing required fields:', {
        missingName: !validation.hasName,
        missingEmail: !validation.hasEmail,
        missingMessage: !validation.hasMessage
      });
      
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'email', 'message'],
        received: {
          name: validation.hasName,
          email: validation.hasEmail,
          message: validation.hasMessage
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    console.log('✅ Contact form validation passed');

    // Send email notification
    await sendEmailNotification('contact_form', {
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : undefined,
      message: message.trim()
    });

    console.log('✅ Contact form processed successfully');

    res.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: error.message
    });
  }
});

// ===== Error Handling Middleware =====
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field',
        message: 'Please use the correct file field name'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// ===== 404 Handler =====
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.originalUrl} does not exist`
  });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 CADverse Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 File upload: POST /api/upload/{serviceType}`);
  console.log(`📬 Contact form: POST /api/contact`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;