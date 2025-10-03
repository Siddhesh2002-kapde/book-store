import React, { useState, useEffect } from "react";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name === 'confirm_password' ? 'confirmPassword' : name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email format is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g,''))) newErrors.phone = "Please enter a valid phone number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/accounts/users/register/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        is_staff: formData.role === "admin",
      });
      console.log("Registration successful:", response.data);
      setIsLoading(false);
      window.location.href = "/login";
    } catch (error) {
      setIsLoading(false);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-80"></div>
      </div>

      {/* Form Container */}
      <div className={`relative w-full max-w-lg transform transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-8 text-center relative">
            <h2 className="text-3xl font-bold mb-2">Join BookStore</h2>
            <p className="text-white/80">Create your account and start your reading adventure</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-4">
            {/* Role Selection */}
            <div className="flex justify-center gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="user" checked={formData.role === "user"} onChange={handleInputChange} className="accent-pink-500" />
                User
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="admin" checked={formData.role === "admin"} onChange={handleInputChange} className="accent-purple-500" />
                Admin
              </label>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text" name="firstName" placeholder="First Name"
                  value={formData.firstName} onChange={handleInputChange}
                  className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text" name="lastName" placeholder="Last Name"
                  value={formData.lastName} onChange={handleInputChange}
                  className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleInputChange}
                className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel" name="phone" placeholder="Phone Number"
                value={formData.phone} onChange={handleInputChange}
                className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" placeholder="Password"
                  value={formData.password} onChange={handleInputChange}
                  className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} name="confirm_password" placeholder="Confirm Password"
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className={`w-full p-3 rounded-2xl bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-400`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="accent-pink-500"/>
              <span className="text-gray-300 text-sm">I agree to Terms & Privacy</span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 font-bold text-white hover:scale-105 transition-transform duration-300"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
