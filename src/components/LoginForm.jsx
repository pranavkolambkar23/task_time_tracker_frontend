import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAsync } from '../slices/authSlice';  // Import login action
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, role } = useSelector((state) => state.auth); // Access role from Redux state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect after successful login based on the role
  useEffect(() => {
    if (role === 'employee') {
      navigate('/employee-dashboard');
    } else if (role === 'manager') {
      navigate('/manager-dashboard');
    }
  }, [role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUserAsync({ email, password }))
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  // Render error message if it exists
  const renderError = error && typeof error === 'object' ? error.message || 'An error occurred' : error;

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {renderError && <p className="error-message">{renderError}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
