
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AddToList.css';
import Modal from '../PopUp/PopUp';

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

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${selectedDate.toISOString().split('T')[0]}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);

        // Reset status state for the new date
        const newStatus = {};
        data.forEach((task, index) => {
          newStatus[index] = task.status;
        });
        setStatus(newStatus);
      } else {
        console.error('Failed to fetch tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newTask,
            description: newDescription,
            date: selectedDate.toISOString().split('T')[0],
          }),
        });

        if (response.ok) {
          const task = await response.json();
          setTasks([...tasks, task]);
          setNewTask('');
          setNewDescription('');
        } else {
          console.error('Failed to add task:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditTask(filteredTasks[index].name);
    setEditDescription(filteredTasks[index].description);
  };

  const handleUpdateTask = async () => {
    if (editTask.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${filteredTasks[editIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editTask, description: editDescription }),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          const updatedTasks = tasks.map((task, i) =>
            i === editIndex ? updatedTask : task
          );
          setTasks(updatedTasks);
          setEditIndex(null);
          setEditTask('');
          setEditDescription('');
        } else {
          console.error('Failed to update task:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const confirmDeleteTask = (index) => {
    setTaskToDelete(index);
    setShowModal(true);
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${filteredTasks[taskToDelete]._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTasks = tasks.filter((task, i) => i !== taskToDelete);
        setTasks(updatedTasks);
        setShowModal(false);
        setTaskToDelete(null);
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    // Update local status state
    setStatus(prevStatus => ({ ...prevStatus, [index]: newStatus }));

    const taskId = filteredTasks[index]._id;
    const updatedTask = {
      ...filteredTasks[index],
      status: newStatus,
    };

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        const updatedTasks = tasks.map((task, i) =>
          i === index ? updatedTaskData : task
        );
        setTasks(updatedTasks);
      } else {
        console.error('Failed to update task status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Filter tasks for the selected date
  const filteredTasks = tasks.filter(task => task.date === selectedDate.toISOString().split('T')[0]);

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
          <li key={task._id} className="task-item">
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
                  value={status[index] || task.status}
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
