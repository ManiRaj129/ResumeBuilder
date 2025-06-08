import { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CPassword() {
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  let navigate = useNavigate();
  const uId = parseInt(sessionStorage.getItem("userid"), 10);
  console.log(uId)

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword && current && confirm) {
      if (newPassword === confirm) {
        try {
          const getResponse = await fetch(`http://localhost:8080/users/${uId}`);
          if (getResponse.status === 404) {
            throw new Error("User not found");
          }
          const user = await getResponse.json();
          if (user.password !== current) {
            throw new Error("Current Password Incorrect");
          }

          const updateUrl = `http://127.0.0.1:8080/users/update/${uId}`;
          const updateResponse = await fetch(updateUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: confirm }),
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update password: ${errorData.message}`);
          }

          const result = await updateResponse.json();
          console.log("Success:", result);
          toast.success("Successfully changed password");
          navigate("/dashboard");
        
        } catch (error) {
          console.error("Error:", error);
          toast.error(`Failed: ${error.message}`);
        }
      } else {
        toast.error("New Password and Confirm New password does not match");
      }
    } else {
      toast.error("Enter all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Lock className="w-6 h-6 mr-2" />
          Change Password
        </h1>

        <form className="space-y-4">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label> New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="flex items-center cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-xl"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
