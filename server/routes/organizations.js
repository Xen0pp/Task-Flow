const express = require('express');
const Organization = require('../models/Organization');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create organization
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if user already has an organization
    if (req.user.organization) {
      return res.status(400).json({ message: 'User already belongs to an organization' });
    }

    const organization = new Organization({
      name,
      description,
      owner: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    await organization.save();

    // Update user's organization
    await User.findByIdAndUpdate(req.user._id, { 
      organization: organization._id
    });

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join organization by invite code
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (req.user.organization) {
      return res.status(400).json({ message: 'User already belongs to an organization' });
    }

    const organization = await Organization.findOne({ inviteCode });
    if (!organization) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Add user to organization
    organization.members.push({
      user: req.user._id,
      role: 'member'
    });
    await organization.save();

    // Update user's organization
    await User.findByIdAndUpdate(req.user._id, { 
      organization: organization._id,
      role: 'member'
    });

    res.json({
      message: 'Successfully joined organization',
      organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get organization details
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.organization) {
      return res.status(404).json({ message: 'User not part of any organization' });
    }

    const organization = await Organization.findById(req.user.organization)
      .populate('members.user', 'name email avatar')
      .populate('owner', 'name email');

    res.json({ organization });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get organization members
router.get('/members', auth, async (req, res) => {
  try {
    if (!req.user.organization) {
      return res.status(404).json({ message: 'User not part of any organization' });
    }

    const organization = await Organization.findById(req.user.organization)
      .populate('members.user', 'name email avatar isActive');

    res.json({ members: organization.members });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
