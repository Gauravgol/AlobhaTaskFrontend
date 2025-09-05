import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Fetch logs (Admin only)
export const fetchLogs = createAsyncThunk("logs/fetch", async (filters, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/logs", {
      params: filters || {},
    });
    // Extract the data array from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const logSlice = createSlice({
  name: "logs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default logSlice.reducer;
