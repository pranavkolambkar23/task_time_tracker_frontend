// src/components/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { logout } from "../slices/authSlice"; // Import logout action
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, token, role } = useSelector((state) => state.auth);
  const [error, setError] = useState(null); // Local state to store errors if any
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectForm] = Form.useForm();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tracker/tasks/",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        }
      );
      setTasks(response.data.tasks); // Update state with the new list of tasks
    } catch (error) {
      setError("Failed to load tasks");
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (role === "manager" && token) {
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

  const handleApprove = async (taskId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tracker/task/${taskId}/action/`,
        {
          action: "approve", // Action to approve the task
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Task approved successfully");
      fetchTasks();
    } catch (error) {
      console.error("Approval failed", error);
      message.error("Failed to approve task");
    }
  };

  const openRejectModal = (task) => {
    setSelectedTask(task);
    setIsRejectModalOpen(true);
  };

  const handleReject = async (values) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tracker/task/${selectedTask.id}/action/`,
        {
          comment: values.comment, // Comment from the form
          action: "reject", // Assuming you pass a rejection action, modify if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Task rejected successfully");
      setIsRejectModalOpen(false);
      rejectForm.resetFields();
      fetchTasks(); // Refresh the tasks list
    } catch (error) {
      console.error("Rejection failed", error);
      message.error("Failed to reject task");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2>Manager Dashboard</h2>
      <p>Welcome to the manager dashboard.</p>

      <div>
        <h3>Employee Tasks</h3>
        {tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <strong>Employee</strong>: {task.employee}
                </div>
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

                {task.status === "pending" && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleApprove(task.id)}
                      style={{
                        marginRight: "8px",
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
                    >
                      Approve
                    </Button>

                    <Button danger onClick={() => openRejectModal(task)}>
                      Reject
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

      {/* Reject Task Modal */}
      <Modal
        title="Reject Task"
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        footer={null}
      >
        <Form form={rejectForm} onFinish={handleReject} layout="vertical">
          <Form.Item label="Comment (Optional)" name="comment">
            <Input.TextArea
              rows={3}
              placeholder="Enter comment for rejection"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block danger>
              Submit Rejection
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
