import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <a href="/dashboard">Dashboard</a> |{" "}
      <a href="/teams">Teams</a> |{" "}
      <a href="/logs">Logs</a> |{" "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
