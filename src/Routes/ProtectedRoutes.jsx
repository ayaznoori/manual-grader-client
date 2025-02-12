// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = Cookies.get("token"); // Read token from cookies
    const userRole = Cookies.get("role"); // Read user role from cookies
    if (!token) {
        return <Navigate to="/login" replace />; // Redirect if not authenticated
    }

    try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const isExpired = tokenData.exp * 1000 < Date.now();
        if (isExpired) {
            Cookies.remove("token");
            Cookies.remove("userid");
            Cookies.remove("role")
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        Cookies.remove("token");
        Cookies.remove("userid");
        Cookies.remove("role");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />; // Redirect if role is not allowed
    }

    return children;
};

export default ProtectedRoute;
