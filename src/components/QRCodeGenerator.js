 import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ bookingId, slot, floor, vehicleType, startTime, endTime }) => {
  const qrData = JSON.stringify({
    bookingId,
    slot,
    floor,
    vehicleType,
    startTime,
    endTime,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-gray-800">Digital Parking Pass</h3>
        <p className="text-sm text-gray-600">Scan at entrance</p>
      </div>
      
      <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
        <QRCodeSVG 
          value={qrData}
          size={200}
          level="H"
          includeMargin={true}
          fgColor="#1f2937"
          bgColor="#ffffff"
        />
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
        <p>Slot: <span className="font-semibold">{slot}</span></p>
        <p>Floor: <span className="font-semibold">{floor}</span></p>
        <p>Booking ID: <span className="font-mono">{bookingId?.slice(-6) || "N/A"}</span></p>
        <p>Valid until: <span className="font-semibold">
          {endTime ? new Date(endTime).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          }) : "N/A"}
        </span></p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;