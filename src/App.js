 import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParkingProvider } from "./ParkingContext";
import { NotificationProvider } from "./components/NotificationSystem";
import { AdminProvider } from "./AdminContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParkingLotDetails from "./pages/ParkingLotDetails";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// Admin Route Protection Component
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <AdminLogin />;
};

function App() {
  return (
    <NotificationProvider>
      <ParkingProvider>
        <AdminProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/parking-lot/:id" element={<ParkingLotDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Router>
        </AdminProvider>
      </ParkingProvider>
    </NotificationProvider>
  );
}

export default App;