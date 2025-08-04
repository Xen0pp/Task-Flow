const express = require('express');
const Hackathon = require('../models/Hackathon');
const { auth, requireOrganization } = require('../middleware/auth');

const router = express.Router();

// Get all hackathons for organization
router.get('/', auth, requireOrganization, async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ organization: req.user.organization })
      .populate('createdBy', 'name email')
      .populate('collaborators', 'name email')
      .sort({ createdAt: -1 });

    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create hackathon
router.post('/', auth, requireOrganization, async (req, res) => {
  try {
    const hackathonData = {
      ...req.body,
      createdBy: req.user._id,
      organization: req.user.organization
    };

    const hackathon = new Hackathon(hackathonData);
    await hackathon.save();
    
    await hackathon.populate('createdBy', 'name email');
    await hackathon.populate('collaborators', 'name email');

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-created', hackathon);

    res.status(201).json({
      message: 'Hackathon created successfully',
      hackathon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update hackathon
router.put('/:id', auth, requireOrganization, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    Object.assign(hackathon, req.body);
    await hackathon.save();
    
    await hackathon.populate('createdBy', 'name email');
    await hackathon.populate('collaborators', 'name email');

    // Emit to organization members
    await hackathon.populate('createdBy', 'name email');
    await hackathon.populate('collaborators', 'name email');

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-updated', hackathon);

    res.json({
      message: 'Hackathon updated successfully',
      hackathon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete hackathon
router.delete('/:id', auth, requireOrganization, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    await Hackathon.findByIdAndDelete(req.params.id);

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-deleted', { hackathonId: req.params.id });

    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add event to hackathon
router.post('/:id/events', auth, requireOrganization, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const newEvent = { ...req.body };

    hackathon.events.push(newEvent);
    await hackathon.save();

    const addedEvent = hackathon.events[hackathon.events.length - 1];

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-event-added', {
      hackathonId: hackathon._id,
      event: addedEvent
    });

    const populatedHackathon = await Hackathon.findById(hackathon._id)
      .populate('createdBy', 'name email')
      .populate('collaborators', 'name email');

    res.json({
      message: 'Event added successfully',
      hackathon: populatedHackathon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update event in hackathon
router.put('/:id/events/:eventId', auth, requireOrganization, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const event = hackathon.events.id(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);
    await hackathon.save();

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-event-updated', {
      hackathonId: hackathon._id,
      event
    });

    res.json({
      message: 'Event updated successfully',
      hackathon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete event from hackathon
router.delete('/:id/events/:eventId', auth, requireOrganization, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    hackathon.events.id(req.params.eventId).remove();
    await hackathon.save();

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('hackathon-event-deleted', {
      hackathonId: hackathon._id,
      eventId: req.params.eventId
    });

    res.json({
      message: 'Event deleted successfully',
      hackathon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
