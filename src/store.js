// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice'; // Import authSlice

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer, // Add authReducer here
  },
});
