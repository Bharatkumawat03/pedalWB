import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import JobApplication from '../models/JobApplication';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

router.post('/apply', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      positionTitle,
      positionDepartment,
      positionLocation,
      firstName,
      lastName,
      email,
      phone,
      experience,
      currentCompany,
      expectedSalary,
      availableFrom,
      portfolio,
      linkedin,
      coverLetter
    } = req.body;

    const applicationData: any = {
      positionTitle,
      positionDepartment,
      positionLocation,
      firstName,
      lastName,
      email,
      phone,
      experience,
      currentCompany,
      expectedSalary,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      portfolio,
      linkedin,
      coverLetter
    };

    if (req.file) {
      applicationData.resumeUrl = `/uploads/resumes/${req.file.filename}`;
      applicationData.resumeFileName = req.file.originalname;
    }

    const application = new JobApplication(applicationData);
    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will get back to you within 48 hours.',
      data: {
        id: application._id,
        status: application.status
      }
    });
  } catch (error: any) {
    console.error('Error submitting job application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.',
      error: error.message
    });
  }
});

router.get('/applications', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, position } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (position) filter.positionTitle = position;

    const applications = await JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: applications,
      total: applications.length
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

router.get('/applications/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found'
      });
      return;
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
});

export default router;
