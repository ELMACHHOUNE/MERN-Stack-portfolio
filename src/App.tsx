import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SkillsManager from "./components/admin/SkillsManager";
import ExperienceManager from "./components/admin/ExperienceManager";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminProfileProvider } from "./context/AdminProfileContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProfileProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <main>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <UserDashboard />
                      </PrivateRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/skills"
                    element={
                      <AdminRoute>
                        <SkillsManager />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/experience"
                    element={
                      <AdminRoute>
                        <ExperienceManager />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </main>
              <Toaster position="top-right" />
            </div>
          </Router>
        </AdminProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
