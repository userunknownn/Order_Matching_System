import React from "react";
import { useLogin } from "../hooks/useLogin";

const LoginForm: React.FC = () => {
  const { username, handleChange, handleSubmit, error } = useLogin();

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          data-testid="username-input"
          aria-label="Username"
          type="text"
          className="form-control"
          value={username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert" data-testid="login-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        data-testid="login-button"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;

