import Cookies from "js-cookie";  

const initialState = {  
  user: null,  
  token: null,  
  loading: false,  
  error: null,  
  success: false,  
};  

const authReducer = (state = initialState, action) => {  
  switch (action.type) {  
    case "LOGIN_START":  
      return { ...state, loading: true, error: null, success: false };  
    case "LOGIN_SUCCESS":  
      return {  
        ...state,  
        user: action.payload.user,  
        token: action.payload.token,  
        loading: false,  
        success: true,  
        error: null,  
      };  
    case "LOGIN_FAILURE":  
      return { ...state, loading: false, error: action.payload, success: false };  
    case "LOGOUT":  
      return { ...state, user: null, token: null, loading: false, error: null, success: false };  
    default:  
      return state;  
  }  
};  

export default authReducer;