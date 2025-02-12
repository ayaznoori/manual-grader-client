import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import "./styles/global.css";
import Register from "./components/Register";
import SubmissionsList from "./components/SubmisionList";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { logoutUser } from "./redux/actions/authActions";
import AssignmentsList from "./pages/AssignmentList";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = Cookies.get("token");
      if (!token) {
        dispatch(logoutUser()); // If no token, log out the user
        navigate("/login");
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const isExpired = tokenData.exp * 1000 < Date.now(); // Check expiration

        if (isExpired) {
          dispatch(logoutUser()); // Dispatch logout
          navigate("/login");
        }
      } catch (error) {
        dispatch(logoutUser());
        navigate("/login");
      }
    };

    checkTokenValidity();
  }, [dispatch, navigate]);

    return (
        <div>
            <Navbar/>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><AssignmentsList /></ProtectedRoute>} />
                <Route path="/assignment/:assessId" element={<ProtectedRoute><SubmissionsList /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}

export default App;
