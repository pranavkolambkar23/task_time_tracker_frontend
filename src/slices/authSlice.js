// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/login/",
        userData
      );
      // Return user data (including token, role, email, and username)
      return response.data; // This includes access token, refresh token, user info
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Set up the slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("access_token") || null,  // Load token from localStorage on app load
    role: localStorage.getItem("role") || null,  // Load role from localStorage
    username: localStorage.getItem("username") || null, // Load username from localStorage (optional)
    user: null,  // Initially null, will be set on login
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.username = null;  // Clear username on logout
      state.user = null;  // Clear user data
      localStorage.removeItem("access_token");  // Clear token from localStorage
      localStorage.removeItem("role");  // Clear role from localStorage
      localStorage.removeItem("username");  // Clear username from localStorage (optional)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;  // Store token in Redux
        state.role = action.payload.user.role;  // Store role in Redux
        state.username = action.payload.user.username;  // Store username in Redux
        state.user = action.payload.user;  // Store user data in Redux

        // Store token, role, and username in localStorage for persistence
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("role", action.payload.user.role);
        localStorage.setItem("username", action.payload.user.username); // Store username in localStorage (optional)
        
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
