import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import Particles from "react-tsparticles";

function Login({ setIsAuthenticated }) {
  const { data, setData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:8000/api/accounts/users/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.tokens.access);
        setData((prev) => ({ ...prev, isAuthenticated: true, user: data.user }));
        navigate("/");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white flex items-center justify-center px-4">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          particles: {
            number: { value: 60 },
            color: { value: ["#60a5fa", "#c084fc", "#f472b6"] },
            size: { value: 2 },
            move: { speed: 1, outMode: "out" },
            opacity: { value: 0.4 },
          },
        }}
      />

      {/* Animated Gradient Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Login Card */}
      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-8">
            <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
              Sign In
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Welcome back! Please login to your account.
            </p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-right text-sm mt-2">
                <a
                  href="/forgot-password"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-70"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>


            </form>

            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
