import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AddToList.css';
import Modal from '../PopUp/PopUp'; // Assuming you have a Modal component

const statuses = ['Yet to Start', 'In Progress', 'Completed'];

const AddToList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [status, setStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter tasks for the selected date
  const filteredTasks = tasks.filter(task => task.date === selectedDate.toISOString().split('T')[0]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { name: newTask, description: newDescription, date: selectedDate.toISOString().split('T')[0] }]);
      setNewTask('');
      setNewDescription('');
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditTask(filteredTasks[index].name);
    setEditDescription(filteredTasks[index].description);
  };

  const handleUpdateTask = () => {
    if (editTask.trim()) {
      const updatedTasks = tasks.map((task, i) =>
        i === editIndex ? { ...task, name: editTask, description: editDescription } : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditTask('');
      setEditDescription('');
    }
  };

  const confirmDeleteTask = (index) => {
    setTaskToDelete(index);
    setShowModal(true);
  };

  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task, i) => i !== taskToDelete);
    setTasks(updatedTasks);
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = (index, newStatus) => {
    setStatus({ ...status, [index]: newStatus });
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="calendar"
      />

      {/* Input group for adding new tasks */}
      <div className="input-group">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Task Name"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task Description"
        />
        <button className="add-task-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {/* Task list for the selected date */}
      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} className="task-item">
            {editIndex === index ? (
              <div className="task-edit">
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  placeholder="Edit Task Name"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Edit Task Description"
                />
                <div className="button-group">
                  <button className="update-task-btn" onClick={handleUpdateTask}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="task-view">
                <div className="task-details">
                  <span className="task-label">Task:</span>
                  <span className="task-text">{task.name}</span>
                  <span className="description-label">Description:</span>
                  <span className="task-description">{task.description}</span>
                </div>
                <select
                  className="status-dropdown"
                  value={status[index] || 'Yet to Start'}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  {statuses.map((statusOption, i) => (
                    <option key={i} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                <div className="button-group">
                  <button className="update-task-btn" onClick={() => handleEditTask(index)}>
                    Update
                  </button>
                  <button className="delete-task-btn" onClick={() => confirmDeleteTask(index)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Confirmation modal */}
      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteTask}
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
};

export default AddToList;
