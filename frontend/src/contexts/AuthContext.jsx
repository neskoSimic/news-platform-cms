import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (
      !savedUser ||
      savedUser === "undefined" ||
      !savedToken ||
      isTokenExpired(savedToken)
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken || isTokenExpired(savedToken)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return null;
    }

    return savedToken;
  });

  function login(userData, token) {
    if (!userData) {
      console.error("Login failed: userData is missing");
      return;
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
