
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Yet to Start', 'In Progress', 'Completed'],
    default: 'Yet to Start',
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

