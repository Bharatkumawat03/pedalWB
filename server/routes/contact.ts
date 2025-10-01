import express, { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';

const router = express.Router();

router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
      return;
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will respond within 24 hours.',
      data: {
        id: contactMessage._id,
        status: contactMessage.status
      }
    });
  } catch (error: any) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
});

router.get('/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: messages,
      total: messages.length
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

router.get('/messages/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error: any) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: error.message
    });
  }
});

router.patch('/messages/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, response } = req.body;
    const updateData: any = {};

    if (status) updateData.status = status;
    if (response) updateData.response = response;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error: any) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
});

export default router;
