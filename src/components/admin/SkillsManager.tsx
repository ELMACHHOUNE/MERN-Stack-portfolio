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

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
  isActive: boolean;
}

const SkillsManager: React.FC = () => {
  const { token } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: "",
    category: "Frontend",
    level: 3,
    icon: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/skills/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    try {
      if (!newSkill.name || !newSkill.category || !newSkill.icon) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSkill.name,
          category: newSkill.category,
          level: newSkill.level || 3,
          icon: newSkill.icon,
          isActive: true,
          order: skills.length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add skill");
      }

      const skill = await response.json();
      setSkills([...skills, skill]);
      setIsAddingSkill(false);
      setNewSkill({
        name: "",
        category: "Frontend",
        level: 3,
        icon: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding skill:", error);
      alert(error instanceof Error ? error.message : "Failed to add skill");
    }
  };

  const handleUpdateSkill = async (skill: Skill) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${skill._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(skill),
        }
      );

      if (response.ok) {
        const updatedSkill = await response.json();
        setSkills(
          skills.map((s) => (s._id === updatedSkill._id ? updatedSkill : s))
        );
        setEditingSkill(null);
      }
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSkills(skills.filter((skill) => skill._id !== id));
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleReorder = async (newOrder: Skill[]) => {
    try {
      const response = await fetch("http://localhost:5000/api/skills/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills: newOrder.map((skill, index) => ({
            _id: skill._id,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        setSkills(newOrder);
      }
    } catch (error) {
      console.error("Error reordering skills:", error);
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
        <h2 className="text-2xl font-bold text-gray-800">Skills Management</h2>
        <button
          onClick={() => setIsAddingSkill(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <IconPlus className="w-5 h-5 mr-2" />
          Add Skill
        </button>
      </div>

      {isAddingSkill && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Level (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Icon (URL)
              </label>
              <input
                type="text"
                value={newSkill.icon}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, icon: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingSkill(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Skill
            </button>
          </div>
        </motion.div>
      )}

      <Reorder.Group axis="y" values={skills} onReorder={handleReorder}>
        {skills.map((skill) => (
          <Reorder.Item
            key={skill._id}
            value={skill}
            className="bg-white p-4 rounded-lg shadow mb-4 flex items-center"
          >
            <IconGripVertical className="w-6 h-6 text-gray-400 mr-4 cursor-grab" />
            <div className="flex-1">
              {editingSkill?._id === skill._id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, name: e.target.value })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <select
                    value={editingSkill.category}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        category: e.target.value,
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingSkill.level}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        level: parseInt(e.target.value),
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editingSkill.icon}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, icon: e.target.value })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <img src={skill.icon} alt={skill.name} className="w-8 h-8" />
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < skill.level ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {editingSkill?._id === skill._id ? (
                <>
                  <button
                    onClick={() => handleUpdateSkill(editingSkill)}
                    className="p-2 text-green-600 hover:text-green-700"
                  >
                    <IconCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingSkill(null)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="p-2 text-blue-600 hover:text-blue-700"
                  >
                    <IconEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <IconTrash className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default SkillsManager;
