import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminProfileProvider } from "./context/AdminProfileContext";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";

// Lazy load components for better performance
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Skills = React.lazy(() => import("./pages/Skills"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Experience = React.lazy(() => import("./pages/Experience"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProfileProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AdminProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
