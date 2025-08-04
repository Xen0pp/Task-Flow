const express = require('express');
const Task = require('../models/Task');
const { auth, requireOrganization } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for organization
router.get('/', auth, requireOrganization, async (req, res) => {
  try {
    const tasks = await Task.find({ organization: req.user.organization })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task
router.post('/', auth, requireOrganization, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user._id,
      organization: req.user.organization
    };

    const task = new Task(taskData);
    await task.save();
    
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('task-created', task);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', auth, requireOrganization, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    await task.save();
    
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('task-updated', task);

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', auth, requireOrganization, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('task-deleted', { taskId: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, requireOrganization, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      organization: req.user.organization 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();
    
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('task-updated', task);

    res.json({
      message: 'Task toggled successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reorder tasks
router.put('/reorder', auth, requireOrganization, async (req, res) => {
  try {
    const { tasks } = req.body;

    const updatePromises = tasks.map((task, index) => 
      Task.findOneAndUpdate(
        { _id: task.id, organization: req.user.organization },
        { order: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Emit to organization members
    req.io.to(req.user.organization.toString()).emit('tasks-reordered', { tasks });

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
