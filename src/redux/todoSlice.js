import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Fetch all todos
export const fetchTodos = createAsyncThunk("todos/fetch", async (filters, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/todos", {
      params: filters || {},
    });
    // Extract the data array from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Create a todo
export const createTodo = createAsyncThunk("todos/create", async (todoData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/todos", todoData);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Update a todo
export const updateTodo = createAsyncThunk("todos/update", async ({ id, todoData }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/todos/${id}`, todoData);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Delete a todo
export const deleteTodo = createAsyncThunk("todos/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/todos/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Share todo access
export const shareTodoAccess = createAsyncThunk("todos/share", async ({ id, userIds }, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/todos/${id}/share`, { userIds });
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
      })
      .addCase(shareTodoAccess.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });
  },
});

export default todoSlice.reducer;
