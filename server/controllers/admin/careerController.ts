import { Request, Response, NextFunction } from 'express';
import JobApplication from '../../models/JobApplication';
import { AuthenticatedRequest } from '../../types';

// @desc    Get all job applications with filters and pagination
// @route   GET /api/admin/careers
// @access  Private/Admin
export const getJobApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { positionTitle: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.position) {
      filter.positionTitle = req.query.position;
    }

    if (req.query.department) {
      filter.positionDepartment = req.query.department;
    }

    // Build sort object
    const sort: any = {};
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const applications = await JobApplication.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await JobApplication.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job application
// @route   GET /api/admin/careers/:id
// @access  Private/Admin
export const getJobApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await JobApplication.findById(req.params.id).select('-__v');

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
      return;
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job application status
// @route   PATCH /api/admin/careers/:id
// @access  Private/Admin
export const updateJobApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, notes } = req.body;
    const updateData: any = {};

    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-__v');

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Job application updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job application
// @route   DELETE /api/admin/careers/:id
// @access  Private/Admin
export const deleteJobApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get career application statistics
// @route   GET /api/admin/careers/analytics
// @access  Private/Admin
export const getCareerAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalApplications = await JobApplication.countDocuments();
    const pendingApplications = await JobApplication.countDocuments({ status: 'pending' });
    const reviewingApplications = await JobApplication.countDocuments({ status: 'reviewing' });
    const shortlistedApplications = await JobApplication.countDocuments({ status: 'shortlisted' });
    const rejectedApplications = await JobApplication.countDocuments({ status: 'rejected' });
    const hiredApplications = await JobApplication.countDocuments({ status: 'hired' });

    // Get applications by position
    const applicationsByPosition = await JobApplication.aggregate([
      {
        $group: {
          _id: '$positionTitle',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get applications by department
    const applicationsByDepartment = await JobApplication.aggregate([
      {
        $group: {
          _id: '$positionDepartment',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get monthly applications for last 6 months
    const monthlyApplications = await JobApplication.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month'
                }
              }
            }
          },
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: totalApplications,
        pending: pendingApplications,
        reviewing: reviewingApplications,
        shortlisted: shortlistedApplications,
        rejected: rejectedApplications,
        hired: hiredApplications,
        byPosition: applicationsByPosition,
        byDepartment: applicationsByDepartment,
        monthlyApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

