import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userID, setuserID] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (userID && password) {
      fetch("http://localhost:8080/users/email/" + userID)
        .then((response) => {
          if (response.status === 404) {
            throw new Error("User not found");
          }
          return response.json();
        })
        .then((data) => {
          if (data.password !== password) {
            alert("Password does not match");
          } else {
            toast.success("Succefully logged in");
            sessionStorage.setItem("userid", JSON.stringify(data.id));
            login();
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        });
    } else {
      alert("Please enter details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={userID}
              onChange={(e) => setuserID(e.target.value)}
              className="w-full px-4 py-2 border rounded-r-xl rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-r-xl rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="flex justify-center text-sm text-gray-600 my-4">
          Don't have an Account? {"  "}
          <button
            type="button"
            className="text-blue-500 cursor-pointer hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
          onClick={() => handleLogin()}
        >
          Login
        </button>
      </div>
    </div>
  );
}
