import { Request, Response, NextFunction } from 'express';
import ContactMessage from '../../models/ContactMessage';
import { AuthenticatedRequest } from '../../types';

// @desc    Get all contact messages with filters and pagination
// @route   GET /api/admin/contact
// @access  Private/Admin
export const getContactMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Build sort object
    const sort: any = {};
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const messages = await ContactMessage.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      success: true,
      data: messages,
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

// @desc    Get single contact message
// @route   GET /api/admin/contact/:id
// @access  Private/Admin
export const getContactMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await ContactMessage.findById(req.params.id).select('-__v');

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
      return;
    }

    // Mark as read if it's new
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status or response
// @route   PATCH /api/admin/contact/:id
// @access  Private/Admin
export const updateContactMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, response } = req.body;
    const updateData: any = {};

    if (status) updateData.status = status;
    if (response) updateData.response = response;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-__v');

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact message statistics
// @route   GET /api/admin/contact/analytics
// @access  Private/Admin
export const getContactAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalMessages = await ContactMessage.countDocuments();
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const readMessages = await ContactMessage.countDocuments({ status: 'read' });
    const repliedMessages = await ContactMessage.countDocuments({ status: 'replied' });
    const archivedMessages = await ContactMessage.countDocuments({ status: 'archived' });

    // Get messages by month for last 6 months
    const monthlyMessages = await ContactMessage.aggregate([
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
        total: totalMessages,
        new: newMessages,
        read: readMessages,
        replied: repliedMessages,
        archived: archivedMessages,
        monthlyMessages
      }
    });
  } catch (error) {
    next(error);
  }
};

