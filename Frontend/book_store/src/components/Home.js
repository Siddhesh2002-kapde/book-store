import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                ✨ New arrivals every week
              </span>
            </div>
            <h2 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block text-gray-800">Welcome to</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BookStore
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Discover extraordinary stories, explore infinite worlds, and embark on literary adventures that will transform your imagination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <span className="relative z-10">Browse Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="group bg-white/80 backdrop-blur text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:shadow-lg">
                <span className="flex items-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Magical Library"
                  className="rounded-2xl shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-xl">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm">Books Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats */}
      <section className="relative z-10 -mt-20 mb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '10K+', label: 'Happy Readers', icon: '😊' },
                { number: '5K+', label: 'Books Sold', icon: '📚' },
                { number: '50+', label: 'Authors', icon: '✍️' },
                { number: '24/7', label: 'Support', icon: '🚀' }
              ].map((stat, index) => (
                <div key={index} className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of book shopping with our premium features and unmatched service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Infinite Collection',
                description: 'Discover thousands of books across every genre, from timeless classics to cutting-edge contemporary works.',
                icon: '🌟',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Lightning Delivery',
                description: 'Get your literary treasures delivered to your doorstep with our premium express shipping service.',
                icon: '⚡',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Unbeatable Value',
                description: 'Enjoy premium books at incredible prices with our exclusive deals and membership benefits.',
                icon: '💎',
                gradient: 'from-green-500 to-teal-500'
              }
            ].map((feature, index) => (
              <div key={index} className={`group transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 300}ms` }}>
                <div className="relative h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur transition duration-1000 group-hover:duration-200" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                  <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 h-full shadow-xl border border-white/20 group-hover:shadow-2xl transition-all duration-500">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-6">
                      <a href="#" className="inline-flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                        Learn More
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
              <h3 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of book lovers and discover your next favorite story today
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📚</span>
                </div>
                <h4 className="text-2xl font-bold">BookStore</h4>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your gateway to infinite stories and boundless imagination. Discover, read, and grow with us.
              </p>
              <div className="flex space-x-4">
                {['📘', '📗', '📙', '📕'].map((emoji, index) => (
                  <div key={index} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer">
                    <span className="text-lg">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                {['Home', 'About', 'Books', 'Authors', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="space-y-2">
                {['Help Center', 'Returns', 'Shipping', 'FAQ', 'Privacy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BookStore. All rights reserved. Made with 💜 for book lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;