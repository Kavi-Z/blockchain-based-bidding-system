import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}><h2>Loading Authentication...</h2></div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required, check localStorage
  if (allowedRole) {
    const userRole = localStorage.getItem('userRole');
    if (userRole && userRole !== allowedRole) {
      // If they are a BIDDER trying to access SELLER pages, send them to bidder dashboard
      if (userRole === 'BIDDER') {
        return <Navigate to="/bidder-dashboard" replace />;
      }
      // If they are a SELLER trying to access BIDDER pages, send them to seller dashboard
      if (userRole === 'SELLER') {
        return <Navigate to="/seller-dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
