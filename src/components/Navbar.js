 import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ParkingContext } from "../ParkingContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, bookings } = useContext(ParkingContext);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on component mount and when user changes
  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
    
    // Listen for storage changes (if admin logs in/out in another tab)
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
        🅿️ ParkMate
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-gray-200 transition">Dashboard</Link>
        <Link to="/bookings" className="hover:text-gray-200 transition flex items-center gap-1">
          My Bookings
          {bookings.length > 0 && (
            <span className="bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {bookings.length}
            </span>
          )}
        </Link>
        
        {/* Admin Link - Only show if user is admin */}
        {isAdmin && (
          <Link 
            to="/admin" 
            className="hover:text-gray-200 transition bg-yellow-500 px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
          >
            👑 Admin
          </Link>
        )}
        
        {/* Notification Bell */}
        <NotificationBell />
        
        <Link to="/login" className="hover:text-gray-200 transition">
          {user ? `👤 ${user.name}` : 'Login'}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;