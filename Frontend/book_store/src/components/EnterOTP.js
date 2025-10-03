import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../context/CartContext";
import Particles from "react-tsparticles";

function EnterOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
  const token = localStorage.getItem("resetToken");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/accounts/users/password_reset/`, {
        email,
        otp,
        token,
        password: "temp",
      });
      navigate("/reset-password");
    } catch (error) {
      alert(error.response?.data?.detail || "Invalid OTP or token");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex justify-center items-center px-4">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          particles: {
            number: { value: 50 },
            color: { value: ["#60a5fa", "#c084fc", "#f472b6"] },
            size: { value: 3 },
            move: { speed: 1, outMode: "out" },
            opacity: { value: 0.4 },
          },
        }}
      />

      {/* OTP Form Card */}
      <form
        onSubmit={handleVerify}
        className="relative z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
          Enter OTP
        </h2>
        <p className="text-gray-300 mb-6">
          Please enter the OTP sent to your email <span className="font-semibold">{email}</span>
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default EnterOTP;
