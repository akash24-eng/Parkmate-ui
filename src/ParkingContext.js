 import React, { createContext, useState, useEffect } from "react";

export const ParkingContext = createContext();

// Vehicle types configuration
export const vehicleTypes = {
  car: { 
    id: "car", 
    name: "Car", 
    color: "blue", 
    icon: "🚗",
    hourlyRate: 20,
    dailyRate: 200
  },
  bike: { 
    id: "bike", 
    name: "Bike", 
    color: "green", 
    icon: "🏍️",
    hourlyRate: 10,
    dailyRate: 100
  },
  suv: { 
    id: "suv", 
    name: "SUV", 
    color: "red", 
    icon: "🚙",
    hourlyRate: 30,
    dailyRate: 300
  },
  ev: { 
    id: "ev", 
    name: "EV Charging", 
    color: "purple", 
    icon: "⚡",
    hourlyRate: 25,
    dailyRate: 250
  }
};

// Booking durations
export const bookingDurations = [
  { value: "1", label: "1 Hour", hours: 1 },
  { value: "2", label: "2 Hours", hours: 2 },
  { value: "4", label: "4 Hours", hours: 4 },
  { value: "8", label: "8 Hours", hours: 8 },
  { value: "24", label: "24 Hours", hours: 24 }
];

const initialParkingLots = [
  { 
    id: 1, 
    name: "Main Mall Lot", 
    total: 150, 
    available: 45,
    floors: 3,
    vehicleSupport: ["car", "suv", "ev"],
    floorDetails: [
      { floor: "G", total: 50, available: 12, vehicleSlots: { car: 30, suv: 15, ev: 5 } },
      { floor: "1", total: 50, available: 18, vehicleSlots: { car: 40, suv: 10 } },
      { floor: "2", total: 50, available: 15, vehicleSlots: { car: 35, suv: 15 } }
    ]
  },
  { 
    id: 2, 
    name: "Airport Lot A", 
    total: 200, 
    available: 0,
    floors: 2,
    vehicleSupport: ["car", "bike", "suv"],
    floorDetails: [
      { floor: "P1", total: 100, available: 0, vehicleSlots: { car: 70, bike: 20, suv: 10 } },
      { floor: "P2", total: 100, available: 0, vehicleSlots: { car: 80, bike: 20 } }
    ]
  },
  { 
    id: 3, 
    name: "Stadium Parking", 
    total: 120, 
    available: 30,
    floors: 4,
    vehicleSupport: ["car", "bike", "suv", "ev"],
    floorDetails: [
      { floor: "B1", total: 30, available: 5, vehicleSlots: { car: 20, bike: 10 } },
      { floor: "B2", total: 30, available: 8, vehicleSlots: { car: 25, suv: 5 } },
      { floor: "B3", total: 30, available: 10, vehicleSlots: { car: 15, ev: 15 } },
      { floor: "B4", total: 30, available: 7, vehicleSlots: { car: 20, bike: 5, suv: 5 } }
    ]
  },
];

export const ParkingProvider = ({ children }) => {
  const [parkingLots, setParkingLots] = useState(() => {
    const saved = localStorage.getItem("parkingLots");
    return saved ? JSON.parse(saved) : initialParkingLots;
  });

  const [selectedVehicleType, setSelectedVehicleType] = useState("car");
  const [bookingDuration, setBookingDuration] = useState("1");
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("parkingBookings");
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("parkingUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Calculate price based on vehicle type and duration
  const calculatePrice = (vehicleType, durationValue) => {
    const vehicle = vehicleTypes[vehicleType];
    const duration = bookingDurations.find(d => d.value === durationValue);
    if (!vehicle || !duration) return 0;
    
    if (duration.hours >= 24) {
      const days = Math.ceil(duration.hours / 24);
      return days * vehicle.dailyRate;
    }
    return duration.hours * vehicle.hourlyRate;
  };

  // Add new booking
  const addBooking = (bookingData) => {
    const newBooking = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      ...bookingData
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    return newBooking;
  };

  useEffect(() => {
    localStorage.setItem("parkingLots", JSON.stringify(parkingLots));
  }, [parkingLots]);

  useEffect(() => {
    localStorage.setItem("parkingBookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("parkingUser", JSON.stringify(user));
  }, [user]);

  return (
    <ParkingContext.Provider value={{ 
      parkingLots, 
      setParkingLots,
      selectedVehicleType,
      setSelectedVehicleType,
      bookingDuration,
      setBookingDuration,
      vehicleTypes,
      bookingDurations,
      calculatePrice,
      bookings,
      addBooking,
      user,
      setUser
    }}>
      {children}
    </ParkingContext.Provider>
  );
};