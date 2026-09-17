import { useState } from "react";
import "../auth.css";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThreeDot } from "react-loading-indicators";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { loading, error, handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });
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
        <h1>Login</h1>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
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
            Login
          </button>
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
