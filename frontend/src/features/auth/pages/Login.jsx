import React from "react";
import "../auth.css";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="Submit">Register</button>
          <p>
            Not Registered?
            <Link to="/register"> Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
