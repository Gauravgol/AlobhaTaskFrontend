import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Fetch all users (Admin only)
export const fetchUsers = createAsyncThunk("users/fetch", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/users");
    // Extract the data array from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Create user (Admin only)
export const createUser = createAsyncThunk("users/create", async (userData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/users", userData);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Update user (Admin only)
export const updateUser = createAsyncThunk("users/update", async ({ id, userData }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/users/${id}`, userData);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Delete user (Admin only)
export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
