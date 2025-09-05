import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import todoReducer from "./todoSlice";
import teamReducer from "./teamSlice";
import logReducer from "./logSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    teams: teamReducer,
    logs: logReducer,
  },
});

export default store;
