import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "@asgardeo/auth-react";
import './index.css'
import App from './App.jsx'
import './assets/fonts/fonts.css';

const config = {
    signInRedirectURL: import.meta.env.VITE_ASGARDEO_REDIRECT_URL || "http://localhost:5173",
    signOutRedirectURL: import.meta.env.VITE_ASGARDEO_REDIRECT_URL || "http://localhost:5173",
    clientID: import.meta.env.VITE_ASGARDEO_CLIENT_ID || "NoTu8ooL2ohjwr8ylOCBlqfoPQsa",
    baseUrl: import.meta.env.VITE_ASGARDEO_BASE_URL || "https://api.asgardeo.io/t/cryptops",
    scope: ["openid", "profile", "email", "groups", "roles"]
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
