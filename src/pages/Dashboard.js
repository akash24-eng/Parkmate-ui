 import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ParkingContext, vehicleTypes } from "../ParkingContext";

const Dashboard = () => {
  const { parkingLots } = useContext(ParkingContext);

  const getVehicleIcon = (vehicleType) => {
    return vehicleTypes[vehicleType]?.icon || "🚗";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ParkMate Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingLots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{lot.name}</h2>
            
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Total Slots</p>
                <p className="text-lg font-bold text-green-700">{lot.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-lg font-bold text-blue-700">{lot.available}</p>
              </div>
            </div>

            {/* Supported Vehicle Types */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Supported Vehicles:</p>
              <div className="flex flex-wrap gap-2">
                {lot.vehicleSupport?.map((vehicleType) => (
                  <span
                    key={vehicleType}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {getVehicleIcon(vehicleType)} {vehicleTypes[vehicleType]?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Floor Information */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Floors: {lot.floors}</p>
              <div className="space-y-2">
                {lot.floorDetails?.map((floor) => (
                  <div key={floor.floor} className="flex justify-between text-sm">
                    <span className="text-gray-700">Floor {floor.floor}</span>
                    <span className={`font-semibold ${
                      floor.available > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {floor.available}/{floor.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center mb-4">
              <p
                className={`font-bold text-lg ${
                  lot.available > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {lot.available > 0 ? "🟢 Open" : "🔴 Full"}
              </p>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                {Math.round((lot.available / lot.total) * 100)}% Available
              </div>
            </div>

            <Link
              to={`/parking-lot/${lot.id}`}
              state={{ lot }}
              className="block text-center bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-semibold"
            >
              View Parking Layout
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;