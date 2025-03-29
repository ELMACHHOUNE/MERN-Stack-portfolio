import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminProfile {
  name: string;
  email: string;
  profileImage: string | null;
  title?: string;
  location?: string;
  bio?: string;
}

interface AdminProfileContextType {
  profile: AdminProfile | null;
  loading: boolean;
  error: string | null;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(
  undefined
);

export const AdminProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/settings/admin-profile"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch admin profile");
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProfileContext.Provider value={{ profile, loading, error }}>
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
