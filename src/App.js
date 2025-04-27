// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for Login */}
          <Route path="/" element={<LoginForm />} />

          {/* Routes for Dashboards */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
