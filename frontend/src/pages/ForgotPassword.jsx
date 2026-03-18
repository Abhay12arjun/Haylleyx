import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    //////////////////////////////////////////////////////
    // SUBMIT HANDLER
    //////////////////////////////////////////////////////
    const submit = async () => {
        if (!email) {
            return alert("Please enter your email");
        }

        try {
            setLoading(true);

            await API.post("/auth/forgot-password", { email });

            alert("Reset link sent to your email 📧");

        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
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
                    Forgot Password 🔑
                </h2>

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Submit Button */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
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