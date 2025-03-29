import React, { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconGripVertical,
} from "@tabler/icons-react";

interface Experience {
  _id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
  isActive: boolean;
}

const ExperienceManager: React.FC = () => {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: "",
    company: "",
    period: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/experience/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    try {
      if (
        !newExperience.title ||
        !newExperience.company ||
        !newExperience.period ||
        !newExperience.description
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await fetch("http://localhost:5000/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExperience,
          order: experiences.length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add experience");
      }

      const experience = await response.json();
      setExperiences([...experiences, experience]);
      setIsAddingExperience(false);
      setNewExperience({
        title: "",
        company: "",
        period: "",
        description: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding experience:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add experience"
      );
    }
  };

  const handleUpdateExperience = async (experience: Experience) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/experience/${experience._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(experience),
        }
      );

      if (response.ok) {
        const updatedExperience = await response.json();
        setExperiences(
          experiences.map((e) =>
            e._id === updatedExperience._id ? updatedExperience : e
          )
        );
        setEditingExperience(null);
      }
    } catch (error) {
      console.error("Error updating experience:", error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setExperiences(
          experiences.filter((experience) => experience._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleReorder = async (newOrder: Experience[]) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/experience/reorder",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            experiences: newOrder.map((experience, index) => ({
              _id: experience._id,
              order: index,
            })),
          }),
        }
      );

      if (response.ok) {
        setExperiences(newOrder);
      }
    } catch (error) {
      console.error("Error reordering experiences:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Experience Management
        </h2>
        <button
          onClick={() => setIsAddingExperience(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <IconPlus className="w-5 h-5 mr-2" />
          Add Experience
        </button>
      </div>

      {isAddingExperience && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold mb-4">Add New Experience</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Period
              </label>
              <input
                type="text"
                value={newExperience.period}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, period: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingExperience(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Experience
            </button>
          </div>
        </motion.div>
      )}

      <Reorder.Group axis="y" values={experiences} onReorder={handleReorder}>
        {experiences.map((experience) => (
          <Reorder.Item
            key={experience._id}
            value={experience}
            className="bg-white p-4 rounded-lg shadow mb-4"
          >
            <div className="flex items-center">
              <IconGripVertical className="w-6 h-6 text-gray-400 mr-4 cursor-grab" />
              <div className="flex-1">
                {editingExperience?._id === experience._id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingExperience.title}
                      onChange={(e) =>
                        setEditingExperience({
                          ...editingExperience,
                          title: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editingExperience.company}
                      onChange={(e) =>
                        setEditingExperience({
                          ...editingExperience,
                          company: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editingExperience.period}
                      onChange={(e) =>
                        setEditingExperience({
                          ...editingExperience,
                          period: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <textarea
                      value={editingExperience.description}
                      onChange={(e) =>
                        setEditingExperience({
                          ...editingExperience,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingExperience(null)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateExperience(editingExperience)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium">{experience.title}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-gray-500 text-sm">{experience.period}</p>
                    <p className="text-gray-700 mt-2">
                      {experience.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingExperience?._id !== experience._id && (
                  <>
                    <button
                      onClick={() => setEditingExperience(experience)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <IconEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(experience._id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <IconTrash className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ExperienceManager;
