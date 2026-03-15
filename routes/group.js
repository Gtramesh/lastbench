const express = require('express');
const Group = require('../models/Group');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new group
router.post('/create', auth, async (req, res) => {
  try {
    const { groupName, description, memberIds } = req.body;

    if (!groupName) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Prepare members array (include creator)
    const members = [
      {
        userId: req.user._id,
        role: 'admin',
        joinedAt: new Date()
      }
    ];

    // Add other members if provided
    if (memberIds && Array.isArray(memberIds)) {
      for (const memberId of memberIds) {
        // Check if user exists
        const user = await User.findById(memberId);
        if (user && user._id.toString() !== req.user._id.toString()) {
          members.push({
            userId: memberId,
            role: 'member',
            joinedAt: new Date()
          });
        }
      }
    }

    const group = new Group({
      groupName,
      description: description || '',
      createdBy: req.user._id,
      members
    });

    await group.save();
    await group.populate('members.userId', 'username profileImage');
    await group.populate('createdBy', 'username profileImage');

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's groups
router.get('/my-groups', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      'members.userId': req.user._id,
      isActive: true
    })
    .populate('members.userId', 'username profileImage')
    .populate('createdBy', 'username profileImage')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json({ groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group details
router.get('/:groupId', auth, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate('members.userId', 'username profileImage')
      .populate('createdBy', 'username profileImage');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member
    const isMember = group.members.some(
      member => member.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send group message
router.post('/:groupId/message', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message, messageType = 'text' } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    // Create message
    const newMessage = new Message({
      senderId: req.user._id,
      groupId,
      message,
      messageType
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'username profileImage');

    // Update group's last message
    group.lastMessage = newMessage._id;
    group.lastMessageAt = new Date();
    await group.save();

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group messages
router.get('/:groupId/messages', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    // Get messages
    const messages = await Message.find({
      groupId,
      isDeleted: false
    })
    .populate('senderId', 'username profileImage')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Reverse to get chronological order
    const reversedMessages = messages.reverse();

    res.json({ messages: reversedMessages });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to group
router.post('/:groupId/add-member', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if current user is admin or creator
    const currentUserMember = group.members.find(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (currentUserMember.role !== 'admin' && group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(
      member => member.userId.toString() === userId
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add member
    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();
    await group.populate('members.userId', 'username profileImage');

    res.json({
      message: 'Member added successfully',
      group
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave group
router.post('/:groupId/leave', auth, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Not a member of this group' });
    }

    // Remove member
    group.members.splice(memberIndex, 1);

    // If no members left, delete the group
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
      return res.json({ message: 'Group deleted as no members remaining' });
    }

    // If leaving user was creator, assign new admin
    if (group.createdBy.toString() === req.user._id.toString()) {
      const newCreator = group.members[0].userId;
      group.createdBy = newCreator;
      group.members[0].role = 'admin';
    }

    await group.save();

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
