import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const Dashboard: React.FC = () => {
  const stats = [
    { label: "Total Projects", value: "12", path: "/admin/projects" },
    { label: "Skills", value: "8", path: "/admin/skills" },
    { label: "Experience Items", value: "5", path: "/admin/experience" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.path}
              className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-300">
                {stat.label}
              </h3>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-300">
              <span>New project added</span>
              <span className="text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Skill updated</span>
              <span className="text-sm">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Experience section modified</span>
              <span className="text-sm">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/projects/new"
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add New Project
            </Link>
            <Link
              to="/admin/skills/new"
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add New Skill
            </Link>
            <Link
              to="/admin/experience/new"
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Experience
            </Link>
            <Link
              to="/admin/about/edit"
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Edit About Section
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
