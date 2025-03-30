import React, { useState } from "react";
import { toast } from "react-hot-toast";

const AdminSettings: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/settings/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.profileImage);
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // ... rest of the component code ...
  );
};

export default AdminSettings; 