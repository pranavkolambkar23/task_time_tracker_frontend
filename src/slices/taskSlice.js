// src/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';  // Import the axiosInstance

// Async thunk for fetching tasks
export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await axiosInstance.get('/tasks');  // Use the axiosInstance
    return response.data.tasks;
  }
);

// Async thunk for creating a task
export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    const response = await axiosInstance.post('/tasks', taskData); // Use the axiosInstance
    return response.data.task;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTaskAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;
