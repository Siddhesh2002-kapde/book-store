import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../context/CartContext";
import Particles from "react-tsparticles";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/accounts/users/password_reset_request_otp/`, { email });
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("resetOtp", res.data.otp);
      localStorage.setItem("resetToken", res.data.token);
      navigate("/scratch-card");
    } catch (error) {
      alert("Error sending OTP request");
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

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
          Forgot Password
        </h2>
        <p className="text-gray-300 mb-6">
          Enter your email to receive a one-time password reset OTP.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
