import { useState } from "react";
import { API } from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    //////////////////////////////////////////////////////
    // EMAIL SIGNUP
    //////////////////////////////////////////////////////
    const signup = async () => {
        try {
            await API.post("/auth/register", form);

            alert("Signup successful 🚀");

            // ✅ Redirect to login page
            navigate("/login");

        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    //////////////////////////////////////////////////////
    // GOOGLE SIGNUP
    //////////////////////////////////////////////////////
    const googleSignup = async (credentialResponse) => {
        try {
            const res = await API.post("/auth/google", {
                token: credentialResponse.credential,
            });

            // ✅ Save token
            localStorage.setItem("token", res.data.token);

            // ✅ Redirect to dashboard
            navigate("/");

        } catch (err) {
            alert("Google Signup failed");
        }
    };

    //////////////////////////////////////////////////////
    // UI
    //////////////////////////////////////////////////////
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">

            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Account
                </h2>

                {/* Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                {/* Signup Button */}
                <button
                    onClick={signup}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                >
                    Sign Up
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Google Signup */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={googleSignup}
                        onError={() => alert("Google Signup Failed")}
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")} // ✅ FIXED
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}