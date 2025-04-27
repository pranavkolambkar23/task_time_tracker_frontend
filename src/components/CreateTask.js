// src/components/CreateTask.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTaskAsync } from '../slices/taskSlice';

const CreateTask = () => {
  const dispatch = useDispatch();

  // Set the initial status to 'pending' as default for employees
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'pending', // Default to 'pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTaskAsync(taskData)); // Dispatch the async action to create task
    setTaskData({ title: '', description: '', status: 'pending' }); // Reset form, status remains 'pending'
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* Removed the status dropdown */}
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
