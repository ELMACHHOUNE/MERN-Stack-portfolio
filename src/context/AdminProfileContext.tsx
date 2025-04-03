import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  behance?: string;
  gmail?: string;
  whatsapp?: string;
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
  socialLinks?: SocialLinks;
}

interface AdminProfileContextType {
  adminProfile: AdminProfile | null;
  updateAdminProfile: (data: Partial<AdminProfile>) => Promise<AdminProfile>;
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

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // If user is logged in as admin, fetch their profile
      if (user?.isAdmin && token) {
        const response = await fetch(`${API_URL}/api/settings/admin-profile`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin profile");
        }

        const data = await response.json();
        // Ensure all required fields have default values
        const profile = {
          name: data.name || "",
          email: data.email || "",
          title: data.title || "",
          location: data.location || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          interests: data.interests || [],
          values: data.values || [],
          socialLinks: data.socialLinks || {},
        };
        setAdminProfile(profile);
        return profile;
      }
      // If user is logged in but not admin, or not logged in at all, fetch public admin profile
      else {
        const response = await fetch(`${API_URL}/api/settings/public-profile`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch public admin profile");
        }

        const data = await response.json();
        setAdminProfile(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [user, token]);

  const updateAdminProfile = async (
    data: Partial<AdminProfile>
  ): Promise<AdminProfile> => {
    if (!token) throw new Error("No authentication token");

    try {
      console.log("Updating profile with data:", data);
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

      const responseData = await response.json();
      console.log("Received response:", responseData);

      // Extract the user data from the response
      const updatedProfile = responseData.user;
      if (!updatedProfile) {
        throw new Error("No user data in response");
      }

      // Update the state with a complete merge of existing and new data
      setAdminProfile((prev) => {
        if (!prev) return updatedProfile;

        // Create a new object with all the data
        const mergedProfile = {
          ...prev,
          ...updatedProfile,
          // Ensure arrays are properly merged
          interests: Array.isArray(updatedProfile.interests)
            ? [...updatedProfile.interests]
            : prev.interests || [],
          values: Array.isArray(updatedProfile.values)
            ? updatedProfile.values.map((value: Value) => ({ ...value }))
            : prev.values || [],
        };

        console.log("Merged profile:", mergedProfile);
        return mergedProfile;
      });

      return updatedProfile;
    } catch (error) {
      console.error("Error updating admin profile:", error);
      throw error;
    }
  };

  const contextValue = React.useMemo(
    () => ({
      adminProfile,
      updateAdminProfile,
      isLoading,
    }),
    [adminProfile, isLoading]
  );

  return (
    <AdminProfileContext.Provider value={contextValue}>
      {children}
    </AdminProfileContext.Provider>
  );
};
