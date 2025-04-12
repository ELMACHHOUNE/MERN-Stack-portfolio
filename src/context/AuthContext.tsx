import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface User {
  title: string;
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profileImage?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    behance?: string;
    gmail?: string;
    whatsapp?: string;
  };
  interests?: string[];
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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data || !data.token) {
        console.error("Invalid response data:", data);
        throw new Error("Server response missing required data");
      }

      // Store token first
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // Fetch complete profile data
      const profileResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/profile`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const profileData = await profileResponse.json();
      console.log("Profile data:", profileData);
      // Create complete user object
      const userData: User = {
        _id: data._id || data.user?._id,
        name: profileData.name || data.name || data.user?.name,
        email: profileData.email || data.email || data.user?.email,
        isAdmin: data.isAdmin || data.user?.isAdmin || false,
        title: profileData.title || data.title || data.user?.title || "",
        profileImage:
          profileData.profileImage ||
          data.profileImage ||
          data.user?.profileImage,
        socialLinks:
          profileData.socialLinks ||
          data.socialLinks ||
          data.user?.socialLinks ||
          {},
        interests:
          profileData.interests || data.interests || data.user?.interests || [],
      };

      console.log("Final user data:", userData);
      setUser(userData);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

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
