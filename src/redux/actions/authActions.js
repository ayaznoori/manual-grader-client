import axios from "axios";  
import Cookies from "js-cookie";  

 
export const loginUser = (credentials) => async (dispatch) => {  
  dispatch({ type: "LOGIN_START" }); 
  try {  
    const res = await axios.post("https://manual-grader-backend.onrender.com/api/auth/login", credentials, { withCredentials: true });  
    dispatch({  
      type: "LOGIN_SUCCESS",  
      payload: { user: res.data.user, token: res.data.token },  
    });  
    Cookies.set("userid", res.data.user._id); 
    Cookies.set("role",res.data.user?.role)
  } catch (error) {  
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";  
    dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });   
    console.error("Login Error:", error);  
  }  
};  


export const logoutUser = () => (dispatch) => {  
  Cookies.remove("token");
  Cookies.remove("userid"); 
  Cookies.remove("role")
  dispatch({ type: "LOGOUT" }); 
};