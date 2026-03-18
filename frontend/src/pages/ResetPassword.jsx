import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //////////////////////////////////////////////////////
    // SUBMIT HANDLER
    //////////////////////////////////////////////////////
    const submit = async () => {
        if (!password) {
            return alert("Please enter a new password");
        }

        if (password.length < 6) {
            return alert("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            await API.post(`/auth/reset-password/${token}`, { password });

            alert("Password updated successfully ✅");

            // ✅ Redirect to login
            navigate("/login");

        } catch (err) {
            alert(err.response?.data?.message || "Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    //////////////////////////////////////////////////////
    // UI
    //////////////////////////////////////////////////////
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">

            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Reset Password 🔑
                </h2>

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Submit Button */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Reset Password"}
                </button>

                {/* Back to Login */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}