import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  cvUrl?: string;
  yearsOfExperience?: number;
  happyClients?: number;
  theme?: {
    preset?: "girls" | "boys" | "professional" | "custom";
    primary: string;
    secondary: string;
    headingH1: string;
    headingH2: string;
    textBody: string;
    primaryHover?: string;
    accent?: string;
    buttonBg?: string;
    buttonText?: string;
    buttonHoverBg?: string;
    cardBg?: string;
    cardBorder?: string;
    sidebarBg?: string;
    sidebarText?: string;
    sidebarActiveBg?: string;
    sidebarActiveText?: string;
    sidebarHoverBg?: string;
    sidebarHoverText?: string;
  };
}

interface AdminProfileContextType {
  adminProfile: AdminProfile | null;
  updateAdminProfile: (
    _data: Omit<Partial<AdminProfile>, "theme"> & {
      theme?: Partial<AdminProfile["theme"]>;
    },
  ) => Promise<AdminProfile>;
  isLoading: boolean;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(
  undefined,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error(
      "useAdminProfile must be used within an AdminProfileProvider",
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

  const fetchAdminProfile = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // If user is logged in as admin, fetch their profile
      if (user?.isAdmin && token) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/admin-profile`,
          {
            headers,
          },
        );

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
          cvUrl: data.cvUrl || "",
          yearsOfExperience:
            typeof data.yearsOfExperience === "number"
              ? data.yearsOfExperience
              : 0,
          happyClients:
            typeof data.happyClients === "number" ? data.happyClients : 0,
          theme: data.theme || {
            preset: "custom",
            primary: "#4F46E5",
            secondary: "#9333EA",
            headingH1: "#111827",
            headingH2: "#1F2937",
            textBody: "#374151",
            primaryHover: "#4338CA",
            accent: "#10B981",
            buttonBg: "#4F46E5",
            buttonText: "#FFFFFF",
            buttonHoverBg: "#4338CA",
            cardBg: "#FFFFFF",
            cardBorder: "#E5E7EB",
            sidebarBg: "#FFFFFF",
            sidebarText: "#374151",
            sidebarActiveBg: "#E0E7FF",
            sidebarActiveText: "#4F46E5",
            sidebarHoverBg: "#F3F4F6",
            sidebarHoverText: "#4F46E5",
          },
        };
        setAdminProfile(profile);
        return profile;
      }
      // If user is logged in but not admin, or not logged in at all, fetch public admin profile
      else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/public-profile`,
          {
            headers,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch public admin profile");
        }

        const data = await response.json();
        setAdminProfile({
          ...data,
          yearsOfExperience:
            typeof (data as any).yearsOfExperience === "number"
              ? (data as any).yearsOfExperience
              : 0,
          happyClients:
            typeof (data as any).happyClients === "number"
              ? (data as any).happyClients
              : 0,
          theme: (data as any).theme || {
            preset: "custom",
            primary: "#4F46E5",
            secondary: "#9333EA",
            headingH1: "#111827",
            headingH2: "#1F2937",
            textBody: "#374151",
            primaryHover: "#4338CA",
            accent: "#10B981",
            buttonBg: "#4F46E5",
            buttonText: "#FFFFFF",
            buttonHoverBg: "#4338CA",
            cardBg: "#FFFFFF",
            cardBorder: "#E5E7EB",
            sidebarBg: "#FFFFFF",
            sidebarText: "#374151",
            sidebarActiveBg: "#E0E7FF",
            sidebarActiveText: "#4F46E5",
            sidebarHoverBg: "#F3F4F6",
            sidebarHoverText: "#4F46E5",
          },
        });
        return data;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  const updateAdminProfile = React.useCallback(
    async (
      data: Omit<Partial<AdminProfile>, "theme"> & {
        theme?: Partial<AdminProfile["theme"]>;
      },
    ): Promise<AdminProfile> => {
      if (!token) throw new Error("No authentication token");

      try {
        console.log("Updating profile with data:", data);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/admin-profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update admin profile",
          );
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
            yearsOfExperience:
              typeof (updatedProfile as any).yearsOfExperience === "number"
                ? (updatedProfile as any).yearsOfExperience
                : prev.yearsOfExperience || 0,
            happyClients:
              typeof (updatedProfile as any).happyClients === "number"
                ? (updatedProfile as any).happyClients
                : prev.happyClients || 0,
            theme: (updatedProfile as any).theme ||
              prev.theme || {
                preset: "custom",
                primary: "#4F46E5",
                secondary: "#9333EA",
                headingH1: "#111827",
                headingH2: "#1F2937",
                textBody: "#374151",
              },
          };

          console.log("Merged profile:", mergedProfile);
          return mergedProfile;
        });

        return updatedProfile;
      } catch (error) {
        console.error("Error updating admin profile:", error);
        throw error;
      }
    },
    [token],
  );

  const contextValue = React.useMemo(
    () => ({
      adminProfile,
      updateAdminProfile,
      isLoading,
    }),
    [adminProfile, updateAdminProfile, isLoading],
  );

  return (
    <AdminProfileContext.Provider value={contextValue}>
      {children}
    </AdminProfileContext.Provider>
  );
};
