import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function userVerify() {
  const location = useLocation();
  const { name, passEmail, password } = location.state;

  let navigate = useNavigate();

  const [email, setEmail] = useState(passEmail);
  const [otp, setOtp] = useState("");
  const [genOtp, setGenOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/sendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.OTP) setGenOtp(data.OTP);
    else alert("Failed to send OTP, try again!");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (genOtp === otp) {
      const res = await fetch("http://localhost:8080/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await res.json();
      if (result.acknowledged) {
        toast.success("Account Created!");
        navigate("/login");
      } else {
        toast.success("Server Error, try Again");
        navigate("/signup");
      }
    } else {
      setGenOtp("");
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Verification
        </h2>
        <form className="space-y-4">
          {!genOtp ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
