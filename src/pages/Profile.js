import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <p className="p-2 bg-gray-50 rounded">John Doe</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <p className="p-2 bg-gray-50 rounded">john.doe@example.com</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Member Since</label>
            <p className="p-2 bg-gray-50 rounded">January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;