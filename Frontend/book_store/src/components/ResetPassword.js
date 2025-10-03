import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../context/CartContext";
import Particles from "react-tsparticles";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const token = localStorage.getItem("resetToken");
  const otp = localStorage.getItem("resetOtp");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/accounts/users/password_reset/`, {
        email,
        otp,
        token,
        password,
      });

      alert("Password reset successful!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetOtp");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Error resetting password");
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

      {/* Reset Password Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
