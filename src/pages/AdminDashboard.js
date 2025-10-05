 import React from 'react';
import { useAdmin } from '../AdminContext';
import { vehicleTypes } from '../ParkingContext';

const AdminDashboard = () => {
  const { 
    adminStats, 
    timeRange, 
    setTimeRange,
    getRevenueByTimeRange,
    getBookingsByVehicleType,
    parkingLots,
    bookings
  } = useAdmin();

  const revenueByRange = getRevenueByTimeRange();
  const vehicleTypeData = getBookingsByVehicleType();

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-${color}-500`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );

  const ParkingLotCard = ({ lot }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">{lot.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          lot.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {lot.available > 0 ? 'Available' : 'Full'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Slots:</span>
          <span className="font-semibold">{lot.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available:</span>
          <span className="font-semibold text-green-600">{lot.available}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Occupied:</span>
          <span className="font-semibold text-red-600">{lot.total - lot.available}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((lot.total - lot.available) / lot.total) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your parking facilities and view analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Revenue"
            value={`₹${adminStats.totalRevenue}`}
            subtitle={`₹${revenueByRange} this ${timeRange}`}
            icon="💰"
            color="green"
          />
          <StatCard
            title="Total Bookings"
            value={adminStats.totalBookings}
            subtitle={`${adminStats.activeBookings} active`}
            icon="📊"
            color="blue"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${adminStats.occupancyRate.toFixed(1)}%`}
            subtitle="Current capacity"
            icon="🏢"
            color="purple"
          />
          <StatCard
            title="Popular Vehicle"
            value={vehicleTypes[adminStats.popularVehicleType]?.name || 'Car'}
            subtitle={vehicleTypes[adminStats.popularVehicleType]?.icon || '🚗'}
            icon="🚙"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Vehicle Type Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Type Distribution</h3>
            <div className="space-y-3">
              {Object.entries(vehicleTypeData).map(([vehicleType, count]) => (
                <div key={vehicleType} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{vehicleTypes[vehicleType]?.icon}</span>
                    <span className="font-medium text-gray-700">
                      {vehicleTypes[vehicleType]?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / adminStats.totalBookings) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Booking Hours</h3>
            <div className="space-y-4">
              {adminStats.peakHours.map((hour, index) => (
                <div key={hour} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700">{hour}</span>
                  </div>
                  <span className="text-sm text-gray-500">Most bookings</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Consider dynamic pricing during peak hours ({adminStats.peakHours.join(', ')})
              </p>
            </div>
          </div>
        </div>

        {/* Parking Lots Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Parking Lots Management</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
              + Add New Lot
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkingLots.map(lot => (
              <ParkingLotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Bookings</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Slot</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 10).map(booking => {
                  const isActive = booking.endTime && new Date(booking.endTime) > new Date();
                  const vehicle = vehicleTypes[booking.vehicleType];
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        {booking.id?.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                        {booking.slot} (F{booking.floor})
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{vehicle?.icon}</span>
                          <span>{vehicle?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ₹{booking.price}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isActive ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {booking.timestamp ? new Date(booking.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings yet
            </div>
          )}

          {bookings.length > 10 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                View All Bookings ({bookings.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;