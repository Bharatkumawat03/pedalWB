import express, { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';

const router = express.Router();

router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
        return;
      } else {
        existingSubscription.status = 'active';
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        await existingSubscription.save();

        res.json({
          success: true,
          message: 'Successfully re-subscribed! Welcome back to the PedalBharat community.',
          data: {
            email: existingSubscription.email,
            status: existingSubscription.status
          }
        });
        return;
      }
    }

    const subscription = new Newsletter({
      email: email.toLowerCase()
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! Welcome to the PedalBharat community. Check your inbox for a welcome gift!',
      data: {
        email: subscription.email,
        status: subscription.status
      }
    });
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again.',
      error: error.message
    });
  }
});

router.post('/unsubscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list'
      });
      return;
    }

    if (subscription.status === 'unsubscribed') {
      res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed'
      });
      return;
    }

    subscription.status = 'unsubscribed';
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      data: {
        email: subscription.email,
        status: subscription.status
      }
    });
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again.',
      error: error.message
    });
  }
});

router.get('/subscribers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const subscribers = await Newsletter.find(filter)
      .sort({ subscribedAt: -1 })
      .select('-__v');

    const activeCount = await Newsletter.countDocuments({ status: 'active' });
    const unsubscribedCount = await Newsletter.countDocuments({ status: 'unsubscribed' });

    res.json({
      success: true,
      data: subscribers,
      stats: {
        total: subscribers.length,
        active: activeCount,
        unsubscribed: unsubscribedCount
      }
    });
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: error.message
    });
  }
});

export default router;
