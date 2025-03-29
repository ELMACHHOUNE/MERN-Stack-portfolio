import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profileImage: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User; token: string } | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    console.log("AuthProvider: Checking stored auth data");
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      console.log("AuthProvider: Found stored auth data");
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      console.log("AuthProvider: No stored auth data found");
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    console.log("AuthProvider: Attempting registration", { name, email });
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("AuthProvider: Registration response", data);

      if (!response.ok) {
        console.error("AuthProvider: Registration failed", data);
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Please login.");
    } catch (error: any) {
      console.error("AuthProvider: Registration error", error);
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting login", { email });
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("AuthProvider: Login response", data);

      if (!response.ok) {
        console.error("AuthProvider: Login failed", data);
        throw new Error(data.message || "Login failed");
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      console.log("AuthProvider: Login successful", data.user);

      return { user: data.user, token: data.token };
    } catch (error: any) {
      console.error("AuthProvider: Login error", error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    console.log("AuthProvider: Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated }}
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
