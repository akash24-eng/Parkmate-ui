import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParkingContext } from './ParkingContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { parkingLots, bookings } = useContext(ParkingContext);
  
  const [adminStats, setAdminStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeBookings: 0,
    occupancyRate: 0,
    popularVehicleType: '',
    peakHours: []
  });

  const [timeRange, setTimeRange] = useState('today'); // today, week, month, year

  // Calculate admin statistics
  useEffect(() => {
    if (!bookings || !parkingLots) return;

    // Total Revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);

    // Total Bookings
    const totalBookings = bookings.length;

    // Active Bookings
    const activeBookings = bookings.filter(booking => 
      booking.endTime && new Date(booking.endTime) > new Date()
    ).length;

    // Occupancy Rate
    const totalSlots = parkingLots.reduce((sum, lot) => sum + lot.total, 0);
    const occupiedSlots = parkingLots.reduce((sum, lot) => sum + (lot.total - lot.available), 0);
    const occupancyRate = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

    // Popular Vehicle Type
    const vehicleCounts = {};
    bookings.forEach(booking => {
      vehicleCounts[booking.vehicleType] = (vehicleCounts[booking.vehicleType] || 0) + 1;
    });
    const popularVehicleType = Object.keys(vehicleCounts).reduce((a, b) => 
      vehicleCounts[a] > vehicleCounts[b] ? a : b, 'car'
    );

    // Peak Hours (simplified)
    const hourCounts = {};
    bookings.forEach(booking => {
      if (booking.timestamp) {
        const hour = new Date(booking.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    const peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);

    setAdminStats({
      totalRevenue,
      totalBookings,
      activeBookings,
      occupancyRate,
      popularVehicleType,
      peakHours
    });
  }, [bookings, parkingLots]);

  // Get revenue by time range
  const getRevenueByTimeRange = () => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    return bookings
      .filter(booking => new Date(booking.timestamp) >= startDate)
      .reduce((sum, booking) => sum + (booking.price || 0), 0);
  };

  // Get bookings by vehicle type
  const getBookingsByVehicleType = () => {
    const vehicleCounts = {};
    bookings.forEach(booking => {
      vehicleCounts[booking.vehicleType] = (vehicleCounts[booking.vehicleType] || 0) + 1;
    });
    return vehicleCounts;
  };

  // Get hourly occupancy data
  const getHourlyOccupancy = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      hour: `${hour}:00`,
      bookings: bookings.filter(booking => {
        const bookingHour = new Date(booking.timestamp).getHours();
        return bookingHour === hour;
      }).length
    }));
  };

  return (
    <AdminContext.Provider value={{
      adminStats,
      timeRange,
      setTimeRange,
      getRevenueByTimeRange,
      getBookingsByVehicleType,
      getHourlyOccupancy,
      parkingLots,
      bookings
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};