import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface AdminProfile {
  name: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  profileImage: string;
  interests: string[];
  values: Value[];
}

interface AdminProfileContextType {
  adminProfile: AdminProfile | null;
  updateAdminProfile: (data: Partial<AdminProfile>) => Promise<void>;
  isLoading: boolean;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(
  undefined
);

export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error(
      "useAdminProfile must be used within an AdminProfileProvider"
    );
  }
  return context;
};

export const AdminProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user?.isAdmin || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/settings/admin-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin profile");
        }

        const data = await response.json();
        setAdminProfile(data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user, token]);

  const updateAdminProfile = async (data: Partial<AdminProfile>) => {
    if (!token) return;

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
      setAdminProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating admin profile:", error);
      throw error;
    }
  };

  return (
    <AdminProfileContext.Provider
      value={{ adminProfile, updateAdminProfile, isLoading }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};
