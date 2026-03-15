const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  groupImage: {
    type: String,
    default: ''
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isGroupPrivate: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
GroupSchema.index({ 'members.userId': 1 });
GroupSchema.index({ createdBy: 1 });
GroupSchema.index({ groupName: 1 });

// Virtual for member count
GroupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure at least one member (creator)
GroupSchema.pre('save', function(next) {
  if (this.isNew && this.members.length === 0) {
    this.members.push({
      userId: this.createdBy,
      role: 'admin'
    });
  }
  next();
});

module.exports = mongoose.model('Group', GroupSchema);
