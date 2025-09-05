import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../api/authApi";

export const login = createAsyncThunk("auth/login", async (data) => {
  const res = await loginUser(data);
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
});

export const register = createAsyncThunk("auth/register", async (data) => {
  const res = await registerUser(data);
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: JSON.parse(localStorage.getItem("user")) || null, 
    loading: false, 
    error: null 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
