import { useState } from "react";
import { API } from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login({ setIsAuth }) {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 where user came from (for redirect after login)
    const from = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    //////////////////////////////////////////////////////
    // EMAIL LOGIN
    //////////////////////////////////////////////////////
    const login = async () => {

        if (!form.email || !form.password) {
            return alert("Please enter email and password");
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/login", form);

            // ✅ Save token
            localStorage.setItem("token", res.data.token);

            // 🔥 update global auth state
            setIsAuth(true);

            alert("Login successful 🚀");

            // 🔥 redirect to previous page
            navigate(from, { replace: true });

        } catch (err) {
            console.log(err.response?.data);

            alert(
                err.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    //////////////////////////////////////////////////////
    // GOOGLE LOGIN
    //////////////////////////////////////////////////////
    const googleLogin = async (credentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                return alert("Google token missing");
            }

            const res = await API.post("/auth/google", {
                token: credentialResponse.credential,
            });

            // ✅ Save token
            localStorage.setItem("token", res.data.token);

            // 🔥 update auth state
            setIsAuth(true);

            alert("Google Login successful 🚀");

            // 🔥 redirect properly
            navigate(from, { replace: true });

        } catch (err) {
            console.log(err);
            alert("Google Login failed");
        }
    };

    //////////////////////////////////////////////////////
    // FORGOT PASSWORD
    //////////////////////////////////////////////////////
    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    //////////////////////////////////////////////////////
    // UI
    //////////////////////////////////////////////////////
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">

            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back 👋
                </h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    className="w-full mb-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                {/* Forgot Password */}
                <div className="text-right mb-4">
                    <span
                        onClick={handleForgotPassword}
                        className="text-sm text-indigo-600 cursor-pointer hover:underline"
                    >
                        Forgot Password?
                    </span>
                </div>

                {/* Login Button */}
                <button
                    onClick={login}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={googleLogin}
                        onError={() => alert("Google Login Failed")}
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                        Sign Up
                    </span>
                </p>

            </div>
        </div>
    );
}