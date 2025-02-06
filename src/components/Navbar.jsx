import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logoutUser } from "../redux/actions/authActions"; // Import logout action
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token"); // Read token from cookies
  const userRole = Cookies.get("role"); // Read user role from cookies
  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigate("/login"); // Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/"><img src="https://cdn.masaischool.com/masai-website/Masai_Logo_dark_web_b21aab8c62.webp" width={"100px"} alt="Masai School" /></Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            {userRole=="admin" || userRole=="super-admin" && <Link to="/register">Register</Link>}
          </>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
