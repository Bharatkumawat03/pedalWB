import { Request, Response, NextFunction } from 'express';
import Newsletter from '../../models/Newsletter';
import { AuthenticatedRequest } from '../../types';

// @desc    Get all newsletter subscribers with filters and pagination
// @route   GET /api/admin/newsletter
// @access  Private/Admin
export const getSubscribers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.search) {
      filter.email = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Build sort object
    const sort: any = {};
    const sortBy = req.query.sortBy as string || 'subscribedAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const subscribers = await Newsletter.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Newsletter.countDocuments(filter);

    res.json({
      success: true,
      data: subscribers,
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

// @desc    Get single subscriber
// @route   GET /api/admin/newsletter/:id
// @access  Private/Admin
export const getSubscriber = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscriber = await Newsletter.findById(req.params.id).select('-__v');

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
      return;
    }

    res.json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscriber status
// @route   PATCH /api/admin/newsletter/:id
// @access  Private/Admin
export const updateSubscriber = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;
    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'unsubscribed') {
        updateData.unsubscribedAt = new Date();
      } else if (status === 'active') {
        updateData.subscribedAt = new Date();
        updateData.unsubscribedAt = undefined;
      }
    }

    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-__v');

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Subscriber updated successfully',
      data: subscriber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/admin/newsletter/:id
// @access  Private/Admin
export const deleteSubscriber = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk unsubscribe subscribers
// @route   POST /api/admin/newsletter/bulk-unsubscribe
// @access  Private/Admin
export const bulkUnsubscribe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of subscriber IDs'
      });
      return;
    }

    const result = await Newsletter.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: 'unsubscribed',
          unsubscribedAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} subscriber(s) unsubscribed successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter statistics
// @route   GET /api/admin/newsletter/analytics
// @access  Private/Admin
export const getNewsletterAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ status: 'active' });
    const unsubscribedSubscribers = await Newsletter.countDocuments({ status: 'unsubscribed' });

    // Get monthly subscriptions for last 6 months
    const monthlySubscriptions = await Newsletter.aggregate([
      {
        $match: {
          subscribedAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$subscribedAt' },
            month: { $month: '$subscribedAt' }
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

    // Get monthly unsubscriptions for last 6 months
    const monthlyUnsubscriptions = await Newsletter.aggregate([
      {
        $match: {
          unsubscribedAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$unsubscribedAt' },
            month: { $month: '$unsubscribedAt' }
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
        total: totalSubscribers,
        active: activeSubscribers,
        unsubscribed: unsubscribedSubscribers,
        monthlySubscriptions,
        monthlyUnsubscriptions
      }
    });
  } catch (error) {
    next(error);
  }
};



