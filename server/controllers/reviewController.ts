import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types';

// @desc    Check if user can rate/review a product (has delivered order)
// @route   GET /api/products/:productId/can-rate
// @access  Private
export const canUserRate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user has any delivered orders containing this product
    const deliveredOrders = await Order.find({
      user: userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    const canRate = deliveredOrders.length > 0;

    // Check if user already rated/reviewed
    const existingRating = await Review.findOne({
      user: userId,
      product: productId
    });

    res.json({
      success: true,
      data: {
        canRate,
        hasRated: !!existingRating,
        existingRating: existingRating ? {
          rating: existingRating.rating,
          type: existingRating.type,
          id: existingRating._id
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a rating (without review)
// @route   POST /api/products/:productId/rate
// @access  Private
export const submitRating = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
      return;
    }

    // Check if user has delivered order
    const deliveredOrders = await Order.find({
      user: userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (deliveredOrders.length === 0) {
      res.status(403).json({
        success: false,
        message: 'You can only rate products after delivery'
      });
      return;
    }

    // Check if user already rated/reviewed
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });

    if (existingReview) {
      // Update existing rating
      existingReview.rating = rating;
      existingReview.type = existingReview.title || existingReview.comment ? 'review' : 'rating';
      await existingReview.save();

      // Update product rating
      await updateProductRating(productId);

      res.json({
        success: true,
        message: 'Rating updated successfully',
        data: existingReview
      });
      return;
    }

    // Create new rating
    const newRating = new Review({
      user: userId,
      product: productId,
      rating,
      type: 'rating',
      verified: true, // Verified because user has delivered order
      status: 'approved' // Auto-approve ratings
    });

    await newRating.save();

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'You have already rated this product'
      });
      return;
    }
    next(error);
  }
};

// @desc    Submit a review (with rating and text)
// @route   POST /api/products/:productId/review
// @access  Private
export const submitReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
      return;
    }

    if (!title || !comment) {
      res.status(400).json({
        success: false,
        message: 'Title and comment are required for reviews'
      });
      return;
    }

    // Check if user has delivered order
    const deliveredOrders = await Order.find({
      user: userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (deliveredOrders.length === 0) {
      res.status(403).json({
        success: false,
        message: 'You can only review products after delivery'
      });
      return;
    }

    // Check if user already rated/reviewed
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.title = title;
      existingReview.comment = comment;
      existingReview.type = 'review';
      if (images) existingReview.images = images;
      existingReview.status = 'pending'; // Reviews need approval
      await existingReview.save();

      // Update product rating
      await updateProductRating(productId);

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: existingReview
      });
      return;
    }

    // Create new review
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
      type: 'review',
      verified: true, // Verified because user has delivered order
      images: images || [],
      status: 'pending' // Reviews need approval
    });

    await newReview.save();

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be published after approval.',
      data: newReview
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
      return;
    }
    next(error);
  }
};

// Helper function to update product rating
const updateProductRating = async (productId: string): Promise<void> => {
  try {
    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': 0,
        'rating.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      'rating.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
      'rating.count': reviews.length
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// @desc    Get product reviews (with filters)
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', type } = req.query;

    const sortOptions: any = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 }
    };

    const query: any = {
      product: productId,
      status: 'approved' // Only show approved reviews
    };

    // Filter by type if specified (rating or review)
    if (type === 'review') {
      query.type = 'review';
    } else if (type === 'rating') {
      query.type = 'rating';
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName avatar')
      .sort(sortOptions[sort as string] || sortOptions.newest)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const allRatings = await Review.find({
      product: productId,
      status: 'approved'
    }).select('rating');

    const ratingDistribution = {
      5: allRatings.filter(r => r.rating === 5).length,
      4: allRatings.filter(r => r.rating === 4).length,
      3: allRatings.filter(r => r.rating === 3).length,
      2: allRatings.filter(r => r.rating === 2).length,
      1: allRatings.filter(r => r.rating === 1).length
    };

    res.json({
      success: true,
      data: reviews,
      ratingDistribution,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: reviews.length,
        totalReviews: total
      }
    });
  } catch (error) {
    next(error);
  }
};

