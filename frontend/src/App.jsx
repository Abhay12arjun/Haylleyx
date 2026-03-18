import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import ConfigureDashboard from "./pages/ConfigureDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// 🔐 PAGES
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// 🔐 PROTECTED ROUTE
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 prevent flicker

  //////////////////////////////////////////////////////
  // CHECK TOKEN ON LOAD
  //////////////////////////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
    setLoading(false);
  }, []);

  //////////////////////////////////////////////////////
  // LOADING STATE (IMPORTANT)
  //////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>

      {/* ✅ Navbar */}
      {isAuth && <Navbar setIsAuth={setIsAuth} />}

      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            isAuth
              ? <Navigate to="/" replace />
              : <Login setIsAuth={setIsAuth} />
          }
        />

        <Route
          path="/signup"
          element={
            isAuth
              ? <Navigate to="/" replace />
              : <Signup />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configure"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <ConfigureDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔁 FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/" : "/login"} replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;