import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import TeamsPage from "../pages/TeamsPage";
import LogsPage from "../pages/LogsPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/teams" element={<TeamsPage />} />
    <Route path="/logs" element={<LogsPage />} />
  </Routes>
);

export default AppRoutes;
