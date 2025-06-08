import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

export default function DeleteAccount() {
  const [confirmChecked, setConfirmChecked] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const uId = parseInt(sessionStorage.getItem("userid"), 10);

    const url = `http://127.0.0.1:8080/users/delete/${uId}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {        
        const errorText = data.message;
        throw new Error(`Failed to delete: ${errorText}`);
      }
      console.log("Success:", data);
      navigate("/");
      toast.success("Successfully Account Deleted");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Delete Your Account</h2>
        </div>
        <p className="text-gray-600">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost.
        </p>

        <div className="flex items-center space-x-2">
          <input
            id="confirm"
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="confirm" className="text-sm text-gray-700">
            I understand the consequences of deleting my account
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl"
            onClick={() => navigate("/dashboard")}
          >
            cancel
          </button>
          <button
            className={`flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl ${
              confirmChecked ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!confirmChecked}
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
