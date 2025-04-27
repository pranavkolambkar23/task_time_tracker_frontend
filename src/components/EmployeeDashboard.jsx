import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice"; // Import logout action
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDashboard.css"; // Import the CSS file

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, token, role } = useSelector((state) => state.auth); // Access username, token, and role from Redux store
  const [tasks, setTasks] = useState([]); // Local state to store employee tasks
  const [error, setError] = useState(null); // Local state to store errors if any

  useEffect(() => {
    if (role === "employee" && token) {
      axios
        .get("http://127.0.0.1:8000/api/tracker/tasks/", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        })
        .then((response) => {
          setTasks(response.data.tasks);
        })
        .catch((err) => {
          setError("Failed to load tasks");
          console.error("Error fetching tasks:", err);
        });
    }
  }, [role, username, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Handle task deletion
  const handleDelete = (taskId) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tracker/task/${taskId}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      })
      .then(() => {
        // Remove the task from the state after successful deletion
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((err) => {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      });
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      <p>Welcome, {username ? username : "User"}!</p>
      {error && <p className="error-message">{error}</p>}
      <div>
        <h3>Your Tasks</h3>
        {tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <strong>Title</strong>: {task.title}
                </div>
                <div>
                  <strong>Description</strong>: {task.description}
                </div>
                <div>
                  <strong>Status</strong>: {task.status}
                </div>
                <div>
                  <strong>Tags</strong>: {task.tags}
                </div>
                <div>
                  <strong>Date</strong>: {task.date}
                </div>

                {/* Show delete button only if the task is not approved */}
                {task.status !== 'approved' && (
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default EmployeeDashboard;
