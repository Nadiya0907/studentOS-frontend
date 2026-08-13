import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentos_token");
    const stored = localStorage.getItem("studentos_user");

    if (token) {
      setUser(
        stored
          ? JSON.parse(stored)
          : {
              name: "Student",
              email: "student@example.com",
              role: "student",
            }
      );
    }

    setLoading(false);
  }, []);

  const persist = (token, userData) => {
    localStorage.setItem("studentos_token", token);

    localStorage.setItem(
      "studentos_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);

    // Get JWT token from backend response
    const token =
      typeof res.data === "string"
        ? res.data
        : res.data?.token || res.data?.access_token;

    if (!token) {
      throw new Error("No authentication token received");
    }

    /*
     * Backend is returning user information.
     * Support the possible response structures.
     */
    const backendUser =
      res.data?.studentos_user ||
      res.data?.user ||
      (
        res.data?.name && res.data?.email
          ? res.data
          : {}
      );

    const userData = {
      name:
        backendUser.name ||
        credentials.email?.split("@")[0] ||
        "Student",

      email:
        backendUser.email ||
        credentials.email,

      role:
        backendUser.role ||
        "student",

      roll_number:
        backendUser.roll_number,
    };

    // Save token + complete user information
    persist(token, userData);

    return {
      token,
      user: userData,
    };
  };

  const signup = async (data) => {
    return authService.signup(data);
  };

  const logout = async () => {
    await authService.logout();

    localStorage.removeItem("studentos_token");
    localStorage.removeItem("studentos_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}