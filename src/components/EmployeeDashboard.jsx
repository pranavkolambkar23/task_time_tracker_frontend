import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice"; // Import logout action
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDashboard.css"; // Import the CSS file
import { Modal, Button, Form, Input } from "antd"; // Import Ant Design components
import "antd/dist/reset.css"; // Import Ant Design CSS

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, token, role } = useSelector((state) => state.auth); // Access username, token, and role from Redux store
  const [tasks, setTasks] = useState([]); // Local state to store employee tasks
  const [error, setError] = useState(null); // Local state to store errors if any
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm] = Form.useForm();

  const [form] = Form.useForm(); // Ant Design form instance

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

  const handleCreateTask = (values) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/tracker/task/create/",
        {
          title: values.title,
          description: values.description,
          tags: values.tags,
          hours_spent: values.hours_spent,
          date: values.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setTasks([...tasks, response.data.task]); // Add new task to list
        setIsModalOpen(false); // Close modal
        form.resetFields(); // Clear form
      })
      .catch((err) => {
        setError("Failed to create task");
        console.error("Error creating task:", err);
      });
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      tags: task.tags,
      hours_spent: task.hours_spent,
      date: task.date,
    });
  };

  const handleUpdateTask = (values) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/tracker/task/${editingTask.id}/update/`,
        {
          title: values.title,
          description: values.description,
          tags: values.tags,
          hours_spent: values.hours_spent,
          date: values.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update task in the local list
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? response.data.task : task
        );
        setTasks(updatedTasks);
        setIsEditModalOpen(false);
        setEditingTask(null);
        editForm.resetFields();
      })
      .catch((err) => {
        setError("Failed to update task");
        console.error("Error updating task:", err);
      });
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      <p>Welcome, {username ? username : "User"}!</p>
      {error && <p className="error-message">{error}</p>}

      {/* Create Task Button */}
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: "16px" }}
      >
        Create Task
      </Button>
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
                <div>
                  <strong>Hours Spent</strong>: {task.hours_spent}
                </div>

                {task.status !== "approved" && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleEditClick(task)}
                      className="edit-button"
                    >
                      Edit
                    </Button>

                    <Button
                      danger
                      onClick={() => handleDelete(task.id)}
                      className="delete-button"
                    >
                      Delete
                    </Button>
                  </>
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

      {/* Create Task Modal */}
      <Modal
        title="Create New Task"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateTask} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Please enter tags" }]}
          >
            <Input placeholder="Enter tags (comma separated)" />
          </Form.Item>

          <Form.Item
            label="Hours Spent"
            name="hours_spent"
            rules={[{ required: true, message: "Please enter hours spent" }]}
          >
            <Input type="number" placeholder="Enter hours spent" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Task"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleUpdateTask} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Please enter tags" }]}
          >
            <Input placeholder="Enter tags (comma separated)" />
          </Form.Item>

          <Form.Item
            label="Hours Spent"
            name="hours_spent"
            rules={[{ required: true, message: "Please enter hours spent" }]}
          >
            <Input type="number" placeholder="Enter hours spent" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
