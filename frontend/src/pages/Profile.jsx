import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setFirstName(res.data.user.profile?.firstName || "");
        setLastName(res.data.user.profile?.lastName || "");
        setPhone(res.data.user.profile?.phone || "");
        setError(null);
      } else {
        setError(res.data.message);
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      setError("Failed to load profile");
      localStorage.clear();
      navigate("/login");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${backendUrl}/api/user/profile`,
        { firstName, lastName, phone },
        { headers: { token } }
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        fetchUserProfile();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-lg">Loading profile...</div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 px-4">
          <p className="text-lg text-red-600 mb-4">
            {error || "Failed to load profile"}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6">
        <div className="bg-white shadow-lg rounded-lg p-5 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            My Profile
          </h2>

          {/* USER INFO */}
          <div className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 rounded-lg border border-pink-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-semibold text-gray-800">
                  {user.name || "N/A"}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              <span className="font-semibold">Member since:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          {/* TIPS */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs sm:text-sm text-gray-600">
            <p className="font-semibold mb-2">💡 Profile Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep your profile information up to date</li>
              <li>Add your phone number for order updates</li>
              <li>Use logout option from profile menu</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
