import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await dispatch(register(form));
    if (res?.meta?.requestStatus === "fulfilled") {
      navigate("/login");
    } else {
      setError(res?.payload?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
