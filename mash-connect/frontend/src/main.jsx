import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "not-configured";
const app = (
  <BrowserRouter>
    <App googleClientId={googleClientId} />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {googleClientId === "not-configured" ? (
      app
    ) : (
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    )}
  </React.StrictMode>
);
