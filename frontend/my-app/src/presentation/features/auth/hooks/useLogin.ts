import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("username is required");
      return;
    }

    try {
      await login(username);
    } catch {
      setError("login failed.");
    }
  };

  return {
    username,
    handleChange,
    handleSubmit,
    error,
  };
};

