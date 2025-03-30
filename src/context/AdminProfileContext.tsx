import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  profileImage: string | null;
  isAdmin: boolean;
  title?: string;
  location?: string;
  bio?: string;
}

interface AdminProfileContextType {
  adminProfile: AdminProfile | null;
  loading: boolean;
  error: string | null;
  updateAdminProfile: (data: Partial<AdminProfile>) => Promise<void>;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(
  undefined
);

export const AdminProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/settings/admin-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch admin profile");
      }

      const data = await response.json();
      setAdminProfile(data.admin || data);
    } catch (err) {
      console.error("Error fetching admin profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch admin profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [token]);

  const updateAdminProfile = async (data: Partial<AdminProfile>) => {
    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`${API_URL}/api/settings/admin-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update admin profile");
      }

      const updatedProfile = await response.json();
      setAdminProfile(updatedProfile.admin || updatedProfile);
    } catch (err) {
      console.error("Error updating admin profile:", err);
      throw new Error(
        err instanceof Error ? err.message : "Failed to update admin profile"
      );
    }
  };

  return (
    <AdminProfileContext.Provider
      value={{
        adminProfile,
        loading,
        error,
        updateAdminProfile,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);
  if (context === undefined) {
    throw new Error(
      "useAdminProfile must be used within an AdminProfileProvider"
    );
  }
  return context;
};
