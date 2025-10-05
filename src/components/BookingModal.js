 import React, { useContext, useState } from "react";
import { ParkingContext, bookingDurations } from "../ParkingContext";
import { useNotifications } from "./NotificationSystem";
import QRCodeGenerator from "./QRCodeGenerator";

const BookingModal = ({ isOpen, onClose, slot, floor, vehicleType }) => {
  const { 
    bookingDuration, 
    setBookingDuration, 
    vehicleTypes, 
    calculatePrice,
    addBooking,
    user,
    setUser
  } = useContext(ParkingContext);

  const { addNotification } = useNotifications();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    vehicleNumber: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState('form'); // 'form', 'processing', 'success'

  if (!isOpen) return null;

  const price = calculatePrice(vehicleType, bookingDuration);
  const selectedDuration = bookingDurations.find(d => d.value === bookingDuration);

  const handleInputChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleProceedToPay = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.vehicleNumber) {
      alert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setBookingStep('processing');

    // Save user info
    setUser(userInfo);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create booking
      const booking = addBooking({
        slot,
        floor,
        vehicleType,
        duration: bookingDuration,
        price,
        userInfo,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + selectedDuration.hours * 60 * 60 * 1000).toISOString()
      });

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Booking Confirmed!',
        message: `Slot ${slot} booked successfully. Valid until ${new Date(booking.endTime).toLocaleTimeString()}.`
      });

      setBookingStep('success');
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Payment Failed',
        message: 'Please try again or use a different payment method.'
      });
      setBookingStep('form');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setBookingStep('form');
    setIsProcessing(false);
    onClose(bookingStep === 'success');
  };

  const renderFormStep = () => (
    <>
      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Slot:</span>
            <span className="font-semibold">{slot}</span>
          </div>
          <div className="flex justify-between">
            <span>Floor:</span>
            <span className="font-semibold">{floor}</span>
          </div>
          <div className="flex justify-between">
            <span>Vehicle:</span>
            <span className="font-semibold">
              {vehicleTypes[vehicleType]?.icon} {vehicleTypes[vehicleType]?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-semibold">{selectedDuration?.label}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{price}</span>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Duration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bookingDurations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => setBookingDuration(duration.value)}
              className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                bookingDuration === duration.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {duration.label}
              <div className="text-xs opacity-70 mt-1">
                ₹{calculatePrice(vehicleType, duration.value)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Your Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Number *
          </label>
          <input
            type="text"
            name="vehicleNumber"
            value={userInfo.vehicleNumber}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. DL01AB1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleProceedToPay}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay ₹${price}`}
        </button>
      </div>
    </>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment</h3>
      <p className="text-gray-600">Please wait while we confirm your booking...</p>
    </div>
  );

  const renderSuccessStep = () => {
    const booking = {
      id: Date.now().toString(),
      slot,
      floor,
      vehicleType,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + selectedDuration.hours * 60 * 60 * 1000).toISOString()
    };

    return (
      <div className="text-center py-6">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          Your slot {slot} has been successfully booked.
        </p>
        
        {/* QR Code Preview */}
        <div className="mb-6">
          <QRCodeGenerator {...booking} />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Show the QR code at the entrance. 
            Your booking is valid until {new Date(booking.endTime).toLocaleTimeString()}.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl text-white">
          <h2 className="text-2xl font-bold">
            {bookingStep === 'success' ? 'Booking Confirmed!' : 'Confirm Booking'}
          </h2>
          <p className="opacity-90">
            {bookingStep === 'success' ? 'Your parking is reserved' : 'Complete your parking reservation'}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {bookingStep === 'form' && renderFormStep()}
          {bookingStep === 'processing' && renderProcessingStep()}
          {bookingStep === 'success' && renderSuccessStep()}
        </div>

        {/* Security Note */}
        {bookingStep === 'form' && (
          <div className="text-center pb-4">
            <p className="text-xs text-gray-500">
              🔒 Your payment is secure and encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;