const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String
  },
  type: {
    type: String,
    enum: ['milestone', 'event', 'deadline'],
    default: 'milestone'
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  teamName: {
    type: String,
    trim: true
  },
  teamMembers: [{
    type: String,
    trim: true
  }],
  projectIdea: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['registered', 'in-progress', 'submitted', 'completed'],
    default: 'registered'
  },
  events: [eventSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
