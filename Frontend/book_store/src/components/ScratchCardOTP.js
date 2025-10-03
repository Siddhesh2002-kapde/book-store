import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function ScratchCardOTP() {
  // For demo purposes, using a sample OTP
  const navigate = useNavigate();
  const otp = localStorage.getItem("resetOtp")
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    if (!otp) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create scratch image
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Using a scratch card texture from a public source
    img.src = "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=200&fit=crop&q=80";
    
    img.onload = () => {
      // Draw the image on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add silver overlay effect
      ctx.globalAlpha = 0.7;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#d1d5db");
      gradient.addColorStop(0.5, "#e5e7eb");
      gradient.addColorStop(1, "#9ca3af");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Add "SCRATCH HERE" text
      ctx.fillStyle = "#374151";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
    };

    // Fallback if image fails to load
    img.onerror = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#d1d5db");
      gradient.addColorStop(0.5, "#e5e7eb");
      gradient.addColorStop(1, "#9ca3af");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#374151";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
    };

    let isDrawing = false;

    const startDraw = (e) => {
      isDrawing = true;
      draw(e);
    };

    const stopDraw = () => {
      isDrawing = false;
      checkScratched();
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    };

    // Mouse events
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    // Touch events for mobile
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDraw(e.touches[0]);
    });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (isDrawing) draw(e.touches[0]);
    });
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopDraw();
    });

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDraw);
    };
  }, [otp]);

  const checkScratched = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentCount = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentCount++;
    }
    const percent = (transparentCount / (canvas.width * canvas.height)) * 100;
    setScratchPercent(Math.round(percent));
    
    if (percent > 40) {
      setScratched(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
      
      <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 z-10">
        Scratch to Reveal OTP
      </h2>
      
      <p className="text-gray-300 mb-8 text-center z-10">
        Use your mouse or finger to scratch the card below
      </p>

      <div className="relative z-10">
        <div
          style={{
            width: 320,
            height: 160,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            letterSpacing: "0.5rem",
            border: "4px solid rgba(255,255,255,0.1)",
          }}
        >
          {otp}
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={160}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "pointer",
            borderRadius: "1rem",
          }}
        />
      </div>

      {scratchPercent > 0 && (
        <div className="mt-4 text-white text-sm z-10">
          Scratched: {scratchPercent}%
        </div>
      )}

      {scratched && (
        <div className="mt-8 flex flex-col items-center gap-4 z-10">
          <div className="text-green-400 font-semibold text-lg animate-pulse">
            ✓ OTP Revealed Successfully!
          </div>
          <button
            onClick={() => navigate("/enter-otp")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold text-lg shadow-lg hover:scale-110 transition-transform"
          >
            Continue with OTP
          </button>
        </div>
      )}
    </div>
  );
}

export default ScratchCardOTP;