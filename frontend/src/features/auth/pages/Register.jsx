import React from "react";
import "../auth.css";
import { useNavigate, Link } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="username">UserName</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
            />
          </div>
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
            Already Registered?
            <Link to="/login"> Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
