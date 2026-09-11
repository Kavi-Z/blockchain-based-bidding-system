## Add React Authentication

### Application Details
- **Application Name:** cryptops
- **Client ID:** NoTu8ooL2ohjwr8ylOCBlqfoPQsa
- **Base URL:** https://api.asgardeo.io/t/cryptops
- **Redirect URL:** http://localhost:5173
- **SDK:** @asgardeo/auth-react

### Task
Add authentication (sign-in and sign-out) to my React application using the official SDK.

### Steps
1. Install the SDK: `npm install @asgardeo/auth-react`
2. Configure the auth provider with the credentials above
3. Add a sign-in button that triggers the login flow
4. Add a sign-out button for authenticated users
5. Display the authenticated user's name/email
6. Protect routes that require authentication


### Starter Code — main.jsx
```
import { AuthProvider } from "@asgardeo/auth-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const config = {
    signInRedirectURL: "http://localhost:5173",
    signOutRedirectURL: "http://localhost:5173",
    clientID: "NoTu8ooL2ohjwr8ylOCBlqfoPQsa",
    baseUrl: "https://api.asgardeo.io/t/cryptops",
    scope: ["openid", "profile"]
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider config={config}>
        <App />
    </AuthProvider>
);
```

### ALWAYS DO
- Use the **exact** Client ID and Base URL provided above
- Use `@asgardeo/auth-react` — this is the official SDK
- Include `openid` and `profile` in the scopes
- Handle the authentication callback at the redirect URL
- Show a loading state while authentication is in progress

### NEVER DO
- Do NOT hardcode credentials — use environment variables for production
- Do NOT use a different SDK than `@asgardeo/auth-react` for React
- Do NOT skip the sign-out redirect URL configuration
- Do NOT store tokens in localStorage manually — the SDK handles this

### Verification Checklist
- [ ] SDK installed and imported correctly
- [ ] Auth provider wraps the application root
- [ ] Sign-in redirects to the login page
- [ ] After login, user is redirected back to the app
- [ ] User info (name/email) is displayed when authenticated
- [ ] Sign-out clears the session and redirects properly

### Documentation
https://is.docs.wso2.com/en/next/quick-starts/react/