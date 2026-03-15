const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get chat history between two users
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Validate user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get messages between current user and target user
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ],
      isDeleted: false
    })
    .populate('senderId', 'username profileImage')
    .populate('receiverId', 'username profileImage')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Reverse to get chronological order
    const reversedMessages = messages.reverse();

    res.json({
      messages: reversedMessages,
      user: {
        id: otherUser._id,
        username: otherUser.username,
        profileImage: otherUser.profileImage,
        status: otherUser.status
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a private message
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, message, messageType = 'text' } = req.body;

    // Validation
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver ID and message are required' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create message
    const newMessage = new Message({
      senderId: req.user._id,
      receiverId,
      message,
      messageType
    });

    await newMessage.save();

    // Populate sender info
    await newMessage.populate('senderId', 'username profileImage');

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all messages involving current user
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ],
      isDeleted: false,
      groupId: null // Only private messages
    })
    .populate('senderId', 'username profileImage')
    .populate('receiverId', 'username profileImage')
    .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.senderId._id.toString() === req.user._id.toString() 
        ? msg.receiverId._id.toString() 
        : msg.senderId._id.toString();
      
      if (!conversations.has(otherUserId)) {
        const otherUser = msg.senderId._id.toString() === req.user._id.toString() 
          ? msg.receiverId 
          : msg.senderId;
        
        conversations.set(otherUserId, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0 // TODO: Implement unread count logic
        });
      }
    });

    res.json({
      conversations: Array.from(conversations.values())
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Mark unread messages as read
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: req.user._id,
        'readBy.userId': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            userId: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit a message
router.put('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const messageDoc = await Message.findById(messageId);
    
    if (!messageDoc) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender
    if (messageDoc.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Update message
    messageDoc.message = message;
    messageDoc.isEdited = true;
    messageDoc.editedAt = new Date();
    await messageDoc.save();

    await messageDoc.populate('senderId', 'username profileImage');

    res.json({
      message: 'Message updated successfully',
      data: messageDoc
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
