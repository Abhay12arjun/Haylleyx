import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// ✅ Google Auth
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);