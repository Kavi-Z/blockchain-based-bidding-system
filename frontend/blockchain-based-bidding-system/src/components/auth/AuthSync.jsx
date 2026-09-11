import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useNavigate } from 'react-router-dom';
import './BlockchainLoader.css';

const AuthSync = () => {
    const { state, getIDToken, getBasicUserInfo } = useAuthContext();
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const syncUserWithBackend = async () => {
            if (state.isAuthenticated) {
                const rawIdToken = await getIDToken();
                const userInfo = await getBasicUserInfo();
                const currentUserEmail = userInfo.email || userInfo.username;
                const storedEmail = localStorage.getItem('userEmail');

                // If the user in Asgardeo doesn't match local storage, clear the stale data
                if (storedEmail && storedEmail !== currentUserEmail) {
                    localStorage.removeItem('internalUserId');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                }

                if (!localStorage.getItem('internalUserId')) {
                    setIsSyncing(true);
                    try {
                    
                    console.log("Basic User Info from Asgardeo:", userInfo);
                    
                    // Retrieve role from Asgardeo groups
                    // Fallback to localStorage if Asgardeo refuses to send groups due to scope limitations
                    const intendedRole = localStorage.getItem('intendedRole');
                    let derivedRole = intendedRole ? intendedRole : 'BIDDER'; 
                    
                    if (userInfo.groups) {
                        const groups = Array.isArray(userInfo.groups) ? userInfo.groups : [userInfo.groups];
                        if (groups.some(g => typeof g === 'string' && g.toLowerCase().includes('seller'))) {
                            derivedRole = 'SELLER';
                        }
                    } else if (userInfo.roles) {
                        const roles = Array.isArray(userInfo.roles) ? userInfo.roles : [userInfo.roles];
                        if (roles.some(r => typeof r === 'string' && r.toLowerCase().includes('seller'))) {
                            derivedRole = 'SELLER';
                        }
                    } 
                    
                    // Exhaustively check all keys in userInfo to see if ANY of them contain 'SELLER'
                    // This is a foolproof way to catch the custom attribute regardless of how Asgardeo names it (e.g. urn:wso2:custom:role)
                    Object.values(userInfo).forEach(value => {
                        if (typeof value === 'string' && value.toUpperCase() === 'SELLER') {
                            derivedRole = 'SELLER';
                        }
                    });
                    
                    // Call the backend to sync the user via JIT Provisioning
                    const response = await fetch('http://localhost:8080/api/auth/sync', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${rawIdToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userInfo.email || userInfo.username,
                            name: userInfo.displayName || userInfo.given_name || userInfo.name || userInfo.username,
                            role: derivedRole
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Store the internal MongoDB user details
                        localStorage.setItem('internalUserId', data.id);
                        localStorage.setItem('userEmail', data.email);
                        localStorage.setItem('userName', data.name || data.email);
                        localStorage.setItem('userRole', data.role); // Save role for ProtectedRoute
                        console.log("User successfully synced with MongoDB:", data.message);

                        // If the user visits the homepage or login pages while authenticated, forcefully redirect them to their dashboard.
                        const currentPath = window.location.pathname;
                        if (currentPath === '/' || currentPath === '/main-login' || currentPath === '/seller-login' || currentPath === '/bidder-login') {
                            if (data.role === 'SELLER') {
                                navigate('/seller-dashboard', { replace: true });
                            } else {
                                navigate('/bidder-dashboard', { replace: true });
                            }
                        }

                    } else {
                        console.error("Failed to sync user with backend");
                    }
                } catch (error) {
                    console.error("Error during user sync:", error);
                } finally {
                    // Small delay so user can see the cool loader
                    setTimeout(() => setIsSyncing(false), 800);
                }
            } else if (state.isAuthenticated && localStorage.getItem('internalUserId')) {
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '/main-login' || currentPath === '/seller-login' || currentPath === '/bidder-login') {
                    const role = localStorage.getItem('userRole');
                    if (role === 'SELLER') {
                        navigate('/seller-dashboard', { replace: true });
                    } else {
                        navigate('/bidder-dashboard', { replace: true });
                    }
                }
            }
        }
    };

        syncUserWithBackend();
    }, [state.isAuthenticated, navigate]);

    if (!isSyncing && !state.isLoading) return null;

    return (
        <div className="blockchain-loader-overlay">
            <div className="blockchain-loader-container">
                <div className="cube-wrapper">
                    <div className="cube">
                        <div className="side front"></div>
                        <div className="side back"></div>
                        <div className="side right"></div>
                        <div className="side left"></div>
                        <div className="side top"></div>
                        <div className="side bottom"></div>
                    </div>
                </div>
                <h2 className="loading-text">Connecting to Blockchain</h2>
                <p className="loading-subtext">Securing your identity & synchronizing data</p>
            </div>
        </div>
    );
};

export default AuthSync;
