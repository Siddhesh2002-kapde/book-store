import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/users/password_reset_request/",
        { email }
      );

      console.log(response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.email || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate back to login
  const handleBackToLogin = () => {
    navigate("/login"); // React Router navigation
  };

  // Render success message after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md transform transition-all duration-1000 translate-y-0 opacity-100 scale-100">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-25 animate-pulse"></div>

          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 w-6 h-6 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-4 left-6 w-3 h-3 bg-white/10 rounded-full"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-green-100">We've sent you reset instructions</p>
              </div>
            </div>

            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We've sent password reset instructions to <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Send Another Email
                </button>

                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render form if not submitted
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Forgot Password Form */}
      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-25 animate-pulse"></div>

        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 w-6 h-6 bg-white/10 rounded-full"></div>
            <div className="absolute top-12 left-8 w-4 h-4 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-8 right-12 w-8 h-8 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-3 h-3 bg-white/10 rounded-full"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-blue-100">No worries, we'll help you reset it</p>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full pl-4 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={handleBackToLogin}
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
