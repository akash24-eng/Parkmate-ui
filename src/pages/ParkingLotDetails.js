 import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ParkingContext, vehicleTypes } from "../ParkingContext";
import { parkingLayouts } from "../parkingLayouts";
import BookingModal from "../components/BookingModal";

const ParkingLotDetails = () => {
  const { 
    parkingLots, 
    setParkingLots,
    setSelectedVehicleType 
  } = useContext(ParkingContext);
  
  const location = useLocation();
  const { lot } = location.state || {};

  const [selectedFloor, setSelectedFloor] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState(new Set());
  const [recentlyBooked, setRecentlyBooked] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localVehicleType, setLocalVehicleType] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Determine current lot safely
  const currentLot = lot?.id ? parkingLots.find((p) => p.id === lot.id) : null;

  // Initialize floors and occupied slots
  useEffect(() => {
    if (currentLot) {
      const lotLayout = parkingLayouts[currentLot.id];
      if (lotLayout && lotLayout.floors) {
        const availableFloors = Object.keys(lotLayout.floors);
        if (availableFloors.length > 0) {
          setSelectedFloor(availableFloors[0]);
        }
        
        // Load occupied slots from localStorage
        const savedOccupied = localStorage.getItem(`occupiedSlots_${currentLot.id}`);
        if (savedOccupied) {
          try {
            setOccupiedSlots(new Set(JSON.parse(savedOccupied)));
          } catch (error) {
            console.error("Error loading occupied slots:", error);
          }
        }
      }
      setIsLoading(false);
    }
  }, [currentLot, setSelectedVehicleType]);

  // Handle vehicle type change
  const handleVehicleTypeChange = (vehicleType) => {
    setLocalVehicleType(vehicleType);
    setSelectedVehicleType(vehicleType);
  };

  // Handle slot click - now opens booking modal
  const handleSlotClick = (slot, slotVehicleType) => {
    if (!localVehicleType) {
      alert("Please select a vehicle type first!");
      return;
    }

    if (occupiedSlots.has(slot)) {
      alert("This slot is already occupied!");
      return;
    }

    if (slotVehicleType !== localVehicleType) {
      alert(`This slot is for ${vehicleTypes[slotVehicleType]?.name}. Please select ${vehicleTypes[slotVehicleType]?.name} from above.`);
      return;
    }

    // Set selected slot and open booking modal
    setSelectedSlot({ slot, vehicleType: slotVehicleType, floor: selectedFloor });
    setShowBookingModal(true);
  };

  // Handle booking confirmation from modal
  const handleBookingConfirm = (isSuccess) => {
    if (isSuccess && selectedSlot) {
      // Mark slot as occupied
      const newOccupiedSlots = new Set([...occupiedSlots, selectedSlot.slot]);
      setOccupiedSlots(newOccupiedSlots);

      // Update global parking lot data
      setParkingLots((prev) =>
        prev.map((p) =>
          p.id === currentLot.id 
            ? { ...p, available: p.available - 1 } 
            : p
        )
      );

      // Show success animation
      setRecentlyBooked(selectedSlot.slot);
      setTimeout(() => setRecentlyBooked(null), 3000);
    }
    
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  // Early returns
  if (!lot || !currentLot || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading parking layout...</p>
        </div>
      </div>
    );
  }

  const lotLayout = parkingLayouts[currentLot.id];
  if (!lotLayout || !lotLayout.floors) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-600 text-xl">Parking layout not defined!</p>
    </div>;
  }

  const availableFloors = Object.keys(lotLayout.floors);
  const currentFloorData = selectedFloor ? lotLayout.floors[selectedFloor] : null;

  if (!currentFloorData) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-600 text-xl">Floor data not found!</p>
    </div>;
  }

  // Get available vehicle types from the layout if not in context
  const getAvailableVehicleTypes = () => {
    if (currentLot.vehicleSupport && currentLot.vehicleSupport.length > 0) {
      return currentLot.vehicleSupport;
    }
    
    const allVehicleTypes = new Set();
    Object.values(lotLayout.floors).forEach(floor => {
      if (floor.vehicleSlots) {
        Object.values(floor.vehicleSlots).forEach(vehicleType => {
          allVehicleTypes.add(vehicleType);
        });
      }
    });
    
    return Array.from(allVehicleTypes);
  };

  const availableVehicleTypes = getAvailableVehicleTypes();

  if (availableVehicleTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">No vehicle types configured!</p>
          <p className="text-gray-600">Please check your parking layout configuration.</p>
        </div>
      </div>
    );
  }

  // Get vehicle color with proper Tailwind classes
  const getVehicleColorClass = (vehicleType, isSelected = false) => {
    const colors = {
      car: isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
      bike: isSelected ? "bg-green-600 text-white border-green-600" : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
      suv: isSelected ? "bg-red-600 text-white border-red-600" : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200", 
      ev: isSelected ? "bg-purple-600 text-white border-purple-600" : "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200"
    };
    return colors[vehicleType] || "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
  };

  // Filter slots by selected vehicle type - show ALL if none selected
  const getFilteredSlots = () => {
    if (!localVehicleType) {
      return currentFloorData.layout.map(row => 
        row.map(slot => slot)
      );
    }
    
    return currentFloorData.layout.map(row => 
      row.map(slot => {
        if (!slot) return null;
        const slotVehicleType = currentFloorData.vehicleSlots?.[slot];
        return slotVehicleType === localVehicleType ? slot : null;
      })
    );
  };

  const filteredSlots = getFilteredSlots();

  // Get slot color class
  const getSlotColorClass = (slotVehicleType, isOccupied = false, isRecentlyBooked = false) => {
    if (isRecentlyBooked) return "bg-yellow-500 hover:bg-yellow-600";
    if (isOccupied) return "bg-red-500 hover:bg-red-600";
    if (!localVehicleType) {
      const colors = {
        car: "bg-blue-400 hover:bg-blue-500",
        bike: "bg-green-400 hover:bg-green-500", 
        suv: "bg-red-400 hover:bg-red-500",
        ev: "bg-purple-400 hover:bg-purple-500"
      };
      return colors[slotVehicleType] || "bg-gray-400 hover:bg-gray-500";
    }
    
    if (slotVehicleType === localVehicleType) {
      const colors = {
        car: "bg-blue-500 hover:bg-blue-600",
        bike: "bg-green-500 hover:bg-green-600",
        suv: "bg-red-500 hover:bg-red-600",
        ev: "bg-purple-500 hover:bg-purple-600"
      };
      return colors[slotVehicleType] || "bg-gray-500 hover:bg-gray-600";
    }
    
    return "bg-gray-300 hover:bg-gray-400 opacity-50 cursor-not-allowed";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentLot.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="bg-green-100 px-3 py-1 rounded-full">
            <span className="font-semibold">Total:</span> {currentLot.total} slots
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="font-semibold">Available:</span> {currentLot.available} slots
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded-full">
            <span className="font-semibold">Floors:</span> {availableFloors.length}
          </div>
        </div>
      </div>

      {/* Vehicle Type Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Vehicle Type</h2>
        <p className="text-gray-600 mb-4 text-sm">Choose your vehicle type to see available slots</p>
        
        {availableVehicleTypes.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3">
              {availableVehicleTypes.map((vehicleType) => {
                const vehicleInfo = vehicleTypes[vehicleType];
                const isSelected = localVehicleType === vehicleType;
                
                return (
                  <button
                    key={vehicleType}
                    onClick={() => handleVehicleTypeChange(vehicleType)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all transform flex items-center gap-2 border-2 ${
                      getVehicleColorClass(vehicleType, isSelected)
                    } ${isSelected ? 'shadow-lg scale-105' : 'hover:scale-105 hover:shadow-md'}`}
                  >
                    <span className="text-lg">{vehicleInfo?.icon}</span>
                    <span>{vehicleInfo?.name}</span>
                    <span className="text-sm opacity-80">
                      (₹{vehicleInfo?.hourlyRate}/hr)
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Selected Vehicle Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              {localVehicleType ? (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Currently Selected:</span> {vehicleTypes[localVehicleType]?.icon} {vehicleTypes[localVehicleType]?.name} | 
                  Rate: <span className="font-semibold">₹{vehicleTypes[localVehicleType]?.hourlyRate}/hour</span> | 
                  Daily: <span className="font-semibold">₹{vehicleTypes[localVehicleType]?.dailyRate}/day</span>
                </p>
              ) : (
                <p className="text-sm text-orange-600 font-semibold">
                  ⚠️ Please select a vehicle type to see available slots
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold">No vehicle types available for this parking lot!</p>
          </div>
        )}
      </div>

      {/* Floor Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Floor</h2>
        <div className="flex flex-wrap gap-3">
          {availableFloors.map((floorKey) => (
            <button
              key={floorKey}
              onClick={() => setSelectedFloor(floorKey)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                selectedFloor === floorKey
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {lotLayout.floors[floorKey]?.name || `Floor ${floorKey}`}
            </button>
          ))}
        </div>
      </div>

      {/* Current Floor Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentFloorData?.name || `Floor ${selectedFloor}`} 
            {localVehicleType && ` - ${vehicleTypes[localVehicleType]?.name} Slots`}
          </h2>
          <div className="text-lg font-semibold">
            <span className="text-green-600">{currentLot.available} Available</span>
          </div>
        </div>

        {/* Vehicle-specific Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          {availableVehicleTypes.map((vehicleType) => (
            <div key={vehicleType} className="flex items-center">
              <div 
                className={`w-4 h-4 rounded mr-2 ${
                  vehicleType === 'car' ? 'bg-blue-500' :
                  vehicleType === 'bike' ? 'bg-green-500' :
                  vehicleType === 'suv' ? 'bg-red-500' :
                  vehicleType === 'ev' ? 'bg-purple-500' : 'bg-gray-500'
                }`}
              ></div>
              <span className={localVehicleType === vehicleType ? "font-semibold" : ""}>
                {vehicleTypes[vehicleType]?.icon} {vehicleTypes[vehicleType]?.name}
                {localVehicleType === vehicleType && " (Selected)"}
              </span>
            </div>
          ))}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Recently Booked</span>
          </div>
          {!localVehicleType && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
              <span>All vehicle types shown</span>
            </div>
          )}
        </div>

        {/* Parking Grid */}
        <div className="relative">
          {recentlyBooked && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
                <div className="text-center">
                  <div className="text-2xl font-bold">🎉 Booking Confirmed!</div>
                  <div className="text-lg mt-1">Slot {recentlyBooked}</div>
                  <div className="text-sm">Check your bookings for details</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            {filteredSlots.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.map((slot, colIndex) => {
                  if (!slot) {
                    return (
                      <div 
                        key={colIndex} 
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 rounded-lg opacity-50"
                        title="Empty Space"
                      ></div>
                    );
                  }

                  const isOccupied = occupiedSlots.has(slot);
                  const isRecentlyBooked = recentlyBooked === slot;
                  const slotVehicleType = currentFloorData.vehicleSlots?.[slot];
                  const canBook = !localVehicleType || slotVehicleType === localVehicleType;

                  return (
                    <div
                      key={colIndex}
                      onClick={() => !isOccupied && canBook && handleSlotClick(slot, slotVehicleType)}
                      className={`
                        relative group transform transition-all duration-300
                        ${getSlotColorClass(slotVehicleType, isOccupied, isRecentlyBooked)}
                        w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center 
                        font-bold text-white rounded-lg shadow-md
                        ${isRecentlyBooked ? 'animate-pulse scale-110' : ''}
                        ${canBook && !isOccupied && !isRecentlyBooked ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                      `}
                    >
                      <span className="text-xs sm:text-sm">
                        {slot.replace(`-${slotVehicleType?.charAt(0).toUpperCase()}`, '')}
                      </span>
                      
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                        {isOccupied ? "🚗 Occupied" : 
                         !localVehicleType ? `${vehicleTypes[slotVehicleType]?.icon} ${vehicleTypes[slotVehicleType]?.name} - Select vehicle type to book` :
                         !canBook ? `${vehicleTypes[slotVehicleType]?.icon} ${vehicleTypes[slotVehicleType]?.name} - Select ${vehicleTypes[slotVehicleType]?.name} from above` :
                         `${vehicleTypes[slotVehicleType]?.icon} Available - Click to Book`}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>

                      {isOccupied && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          ●
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 How to Book</h3>
        <p className="text-blue-700 text-sm">
          1. First select your vehicle type from above<br/>
          2. Then choose a floor<br/>
          3. Click on any available <span className="font-semibold">colored slot</span> to book it<br/>
          4. Complete the booking form and payment<br/>
          5. Get instant confirmation!
        </p>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={handleBookingConfirm}
        slot={selectedSlot?.slot}
        floor={selectedSlot?.floor}
        vehicleType={selectedSlot?.vehicleType}
      />
    </div>
  );
};

export default ParkingLotDetails;