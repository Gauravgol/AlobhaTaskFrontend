import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Todo Manager</h1>
      {user && (
        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          {user.role === "admin" && (
            <>
              <Link to="/teams" className="hover:underline">Teams</Link>
              <Link to="/users" className="hover:underline">Users</Link>
              <Link to="/logs" className="hover:underline">Logs</Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
