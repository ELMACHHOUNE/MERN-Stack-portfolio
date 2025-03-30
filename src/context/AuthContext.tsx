import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      setToken(storedToken);

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if we have the required data
      if (!data || !data.token) {
        console.error("Invalid response data:", data);
        throw new Error("Server response missing required data");
      }

      // Create user object from response
      const userData: User = {
        _id: data._id || data.user?._id,
        name: data.name || data.user?.name,
        email: data.email || data.user?.email,
        isAdmin: data.isAdmin || data.user?.isAdmin || false,
        profileImage: data.profileImage || data.user?.profileImage,
      };

      // Validate required user fields
      if (!userData._id || !userData.name || !userData.email) {
        console.error("Invalid user data:", userData);
        throw new Error("Server response missing required user data");
      }

      localStorage.setItem("token", data.token);
      setUser(userData);
      setToken(data.token);
      toast.success("Login successful!");
      return userData;
    } catch (error) {
      console.error("Login error details:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear local storage and state
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and state even if there's an error
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
