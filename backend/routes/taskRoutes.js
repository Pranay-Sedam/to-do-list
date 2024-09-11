



import express from 'express';
import { getTasksByDate, addTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// Get tasks by date
router.get('/:date', getTasksByDate);

// Add a new task
router.post('/', addTask);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

export default router;

