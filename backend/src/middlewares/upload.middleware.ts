import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../utils/errors.ts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File filter - only allow specific file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type. Only PDF, images (JPEG, PNG, GIF), and Word documents are allowed.'));
  }
};

// Helper function to create storage for different document types
const createStorage = (folderName: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads', folderName);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: timestamp-random-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      // Sanitize filename: remove special characters
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
    },
  });
};

// Configure multer for certifications
export const uploadCertificationFile = multer({
  storage: createStorage('certifications'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure multer for qualifications
export const uploadQualificationFile = multer({
  storage: createStorage('qualifications'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure multer for work passes
export const uploadWorkPassFile = multer({
  storage: createStorage('workpasses'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure multer for general documents
export const uploadDocumentFile = multer({
  storage: createStorage('documents'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware to handle single file upload for certifications
export const singleCertificationUpload = uploadCertificationFile.single('certificate_file');

// Middleware to handle single file upload for qualifications
export const singleQualificationUpload = uploadQualificationFile.single('qualification_file');

// Middleware to handle single file upload for work passes
export const singleWorkPassUpload = uploadWorkPassFile.single('document_file');

// Middleware to handle single file upload for general documents
export const singleDocumentUpload = uploadDocumentFile.single('document_file');

// Middleware to handle errors from multer
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File size too large. Maximum size is 10MB.'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new BadRequestError('Unexpected file field.'));
    }
    return next(new BadRequestError(`Upload error: ${err.message}`));
  }
  if (err) {
    return next(err);
  }
  next();
};

