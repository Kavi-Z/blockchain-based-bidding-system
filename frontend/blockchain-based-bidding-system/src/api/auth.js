// src/api/auth.js

export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    // Read response as text first so we can handle empty bodies gracefully
    const text = await response.text();
    const hasJson = text && text.trim().length > 0;
    const parsed = hasJson ? JSON.parse(text) : null;

    if (!response.ok) {
      const message = parsed?.message || parsed?.error || response.statusText || `Error: ${response.status}`;
      throw new Error(message);
    }

    return parsed?.data || parsed || null;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const text = await response.text();
    const hasJson = text && text.trim().length > 0;
    const parsed = hasJson ? JSON.parse(text) : null;

    if (!response.ok) {
      const message = parsed?.message || parsed?.error || response.statusText || `Error: ${response.status}`;
      throw new Error(message);
    }

    return parsed?.data || parsed || null;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};
