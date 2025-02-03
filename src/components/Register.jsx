import React, { useState } from "react";  
import {useNavigate} from 'react-router-dom'
import axios from "axios";  
import "./Register.css"; // Import the CSS file for styling  

const Register = () => {  
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [role, setRole] = useState("");  
  const [successMessage, setSuccessMessage] = useState("");  
  const [errorMessage, setErrorMessage] = useState("");  
  const navigate= useNavigate();
  const handleSubmit = async (e) => {  
   
    e.preventDefault();  
    setSuccessMessage("");  
    setErrorMessage("");  

    try {  
      const res = await axios.post("http://localhost:5000/api/auth/register", {  
        name,  
        email,  
        password,  
        role,  
      });  
      if (res.status === 201) {  
        setSuccessMessage("Registration successful! You can now log in.");  
        setName("");  
        setEmail("");  
        setPassword("");  
        setRole("");  
        navigate("/login")
      }  
    } catch (error) {  
      setErrorMessage(  
        error.response?.data?.message || "An error occurred during registration."  
      );  
      console.error("Registration Error:", error);  
    }  
  };  
  
  return (  
    <div className="register-container">  
      <div className="register-card">  
        <h2>Register</h2>  
        {successMessage && <div className="success-message">{successMessage}</div>}  
        {errorMessage && <div className="error-message">{errorMessage}</div>}  
        <form onSubmit={handleSubmit}>  
          <div className="form-group">  
            <label>Name</label>  
            <input  
              type="text"  
              value={name}  
              onChange={(e) => setName(e.target.value)}  
              placeholder="Enter your name"  
              required  
            />  
          </div>  
          <div className="form-group">  
            <label>Email</label>  
            <input  
              type="email"  
              value={email}  
              onChange={(e) => setEmail(e.target.value)}  
              placeholder="Enter your email"  
              required  
            />  
          </div>  
          <div className="form-group">  
            <label>Password</label>  
            <input  
              type="password"  
              value={password}  
              onChange={(e) => setPassword(e.target.value)}  
              placeholder="Enter your password"  
              required  
            />  
          </div>  
          <div className="form-group">  
            <label>Role</label>  
            <select  
              value={role}  
              onChange={(e) => setRole(e.target.value)}  
              required  
            >  
              <option value="">Select a role</option>  
              <option value="super-admin">Super Admin</option>  
              <option value="admin">Admin</option>  
              <option value="user">User</option>  
            </select>  
          </div>  
          <button type="submit">Register</button>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default Register;