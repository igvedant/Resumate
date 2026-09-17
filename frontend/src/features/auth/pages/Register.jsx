import { useState } from "react";
import "../auth.css";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThreeDot } from "react-loading-indicators";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const { loading, error, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleRegister({ email, name, username, password });
    if (success) navigate("/");
  };

  if (loading) {
    return (
      <div className="loading">
        <ThreeDot color="rgb(236,49,90)" size="medium" text="" textColor="" />
      </div>
    );
  }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="password"
              name="name"
              autoComplete="name"
              required
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">UserName</label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading}>
            Register
          </button>
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
