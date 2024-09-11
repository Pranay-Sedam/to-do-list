
import Task from '../models/Task.js';

// Get tasks by date
export const getTasksByDate = async (req, res) => {
  try {
    const tasks = await Task.find({ date: req.params.date });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  const { name, description, date, status } = req.body;
  const task = new Task({ name, description, date, status });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
