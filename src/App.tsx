import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ProfileSettings from "./pages/ProfileSettings";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminProfileProvider } from "./context/AdminProfileContext";
import { LanguageProvider } from "./context/LanguageContext";
import { trackPageView } from "./services/analytics";

// Create a wrapper component for analytics tracking
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AdminProfileProvider>
            <Router>
              <AnalyticsWrapper>
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/experience" element={<Experience />} />
                      <Route path="/skills" element={<Skills />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/profile" element={<ProfileSettings />} />
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                  <Toaster position="bottom-right" />
                </div>
              </AnalyticsWrapper>
            </Router>
          </AdminProfileProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
