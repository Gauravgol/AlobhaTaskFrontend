import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Fetch teams
export const fetchTeams = createAsyncThunk("teams/fetch", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/teams");
    // Extract the data array from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Create team (Admin only)
export const createTeam = createAsyncThunk("teams/create", async (teamData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/teams", teamData);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Add user to team (Admin only)
export const addUserToTeam = createAsyncThunk("teams/addUser", async ({ teamId, userId }, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/teams/${teamId}/users`, { userId });
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Remove user from team (Admin only)
export const removeUserFromTeam = createAsyncThunk("teams/removeUser", async ({ teamId, userId }, thunkAPI) => {
  try {
    const res = await axiosInstance.delete(`/teams/${teamId}/users/${userId}`);
    // Extract the data from the response
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(addUserToTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(removeUserFromTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      });
  },
});

export default teamSlice.reducer;
