import React, { useState } from "react";  
import { useSelector, useDispatch } from "react-redux";  
import { loginUser } from "../redux/actions/authActions";  
import "./Login.css";  

const Login = () => {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const { loading, success, error } = useSelector((state) => state.auth); // Access Redux state  
  const dispatch = useDispatch();  

  const handleLogin = (e) => {  
    e.preventDefault();  
    dispatch(loginUser({ email, password })); // Dispatch login action  
  };  

  return (  
    <div className="login-container">  
      <div className="login-card">  
        <h2>Login</h2>  
        {success && <div className="success-message">Login successful!</div>}  
        {error && <div className="error-message">{error}</div>}  
        <form onSubmit={handleLogin}>  
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
          <button type="submit" disabled={loading}>  
            {loading ? "Logging in..." : "Login"}  
          </button>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default Login;