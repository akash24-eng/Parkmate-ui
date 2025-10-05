 import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ParkingContext } from "../ParkingContext";
import QRCodeGenerator from "../components/QRCodeGenerator";

const Bookings = () => {
  const { bookings, user, vehicleTypes, bookingDurations } = useContext(ParkingContext);

  // Safe access to vehicleTypes and bookingDurations
  const safeVehicleTypes = vehicleTypes || {};
  const safeBookingDurations = bookingDurations || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return "N/A";
    
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end - now;
    
    if (diffMs <= 0) return "Expired";
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your parking reservations</p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't made any parking bookings yet.</p>
            <Link 
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Book Your First Slot
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info Card */}
            {user && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Information</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">Name:</span>
                    <p className="text-gray-800">{user.name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Phone:</span>
                    <p className="text-gray-800">{user.phone || "N/A"}</p>
                  </div>
                  {user.email && (
                    <div>
                      <span className="font-semibold text-gray-600">Email:</span>
                      <p className="text-gray-800">{user.email}</p>
                    </div>
                  )}
                  {user.vehicleNumber && (
                    <div>
                      <span className="font-semibold text-gray-600">Vehicle Number:</span>
                      <p className="text-gray-800 font-mono">{user.vehicleNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Your Bookings ({bookings.length})
              </h2>
              
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const duration = safeBookingDurations.find(d => d.value === booking.duration);
                  const vehicle = safeVehicleTypes[booking.vehicleType];
                  const isActive = booking.endTime && new Date(booking.endTime) > new Date();
                  
                  return (
                    <div
                      key={booking.id || booking.timestamp}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        isActive 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{vehicle?.icon || "🚗"}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                Slot {booking.slot || "N/A"} - Floor {booking.floor || "N/A"}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {vehicle?.name || "Vehicle"} • {duration?.label || booking.duration}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-600">Start Time:</span>
                              <p className="text-gray-800">{formatDate(booking.startTime)}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">End Time:</span>
                              <p className="text-gray-800">{formatDate(booking.endTime)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="text-right space-y-2">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isActive ? '🟢 Active' : '🔴 Expired'}
                          </div>
                          
                          {isActive && (
                            <div className="text-sm text-blue-600 font-semibold">
                              {getTimeRemaining(booking.endTime)}
                            </div>
                          )}
                          
                          <div className="text-lg font-bold text-green-600">
                            ₹{booking.price || 0}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Booked on {formatDate(booking.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* QR Code - Real Component */}
                      {isActive && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <QRCodeGenerator
                            bookingId={booking.id}
                            slot={booking.slot}
                            floor={booking.floor}
                            vehicleType={booking.vehicleType}
                            startTime={booking.startTime}
                            endTime={booking.endTime}
                          />
                        </div>
                      )}
                    </div>
                  );
                }).reverse()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;