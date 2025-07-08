import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // generic profile dashboard
import Mentors from "./pages/Mentors";
import Requests from "./pages/Requests";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Availability from "./pages/Availability";
import Sessions from "./pages/Sessions";

// Role-specific dashboards
import MentorDashboard from "./pages/dashboards/MentorDashboard";
import MenteeDashboard from "./pages/dashboards/MenteeDashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  return (
    <Router>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentors"
            element={
              <ProtectedRoute>
                <Mentors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-dashboard"
            element={
              <ProtectedRoute>
                {role === "mentor" ? (
                  <MentorDashboard />
                ) : role === "mentee" ? (
                  <MenteeDashboard />
                ) : (
                  <p>Unauthorized</p>
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/availability"
            element={
              <ProtectedRoute>
                <Availability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
