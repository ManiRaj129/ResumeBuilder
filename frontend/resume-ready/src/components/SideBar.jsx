import {
  FaUserCircle,
  FaLock,
  FaEnvelope,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function SideBar({ isPaneOpen, setIsPaneOpen }) {
  let navigation = useNavigate();
  const { logout } = useAuth();

  const uId = parseInt(sessionStorage.getItem("userid"), 10);

  const [user, setUser] = useState("");
  useEffect(() => {
    GETUser();
  }, []);

  function GETUser() {
    fetch("http://127.0.0.1:8080/users/" + uId)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching user"), error;
      });
  }

  return (
    <div>
      {isPaneOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/10 z-40"
          onClick={() => setIsPaneOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isPaneOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-4xl text-blue-600" />
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaneOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => navigation("/cpass")}
          >
            <FaLock className="text-gray-600" />
            <span>Change Password</span>
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => navigation("/cemail")}
          >
            <FaEnvelope className="text-gray-600" />
            <span>Change Email</span>
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 cursor-pointer"
            onClick={() => navigation("/delete")}
          >
            <FaTrash className="text-red-600" />
            <span className="text-red-600">Delete Account</span>
          </button>

          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              logout();
              navigation("/");
            }}
          >
            <FaSignOutAlt className="text-gray-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
