import axios from "axios";
import {toast} from 'react-toastify'
export const FETCH_IAS_REQUEST = "FETCH_IAS_REQUEST";
export const FETCH_IAS_SUCCESS = "FETCH_IAS_SUCCESS";
export const FETCH_IAS_FAILURE = "FETCH_IAS_FAILURE";
export const ASSIGN_IA_SUCCESS = "ASSIGN_IA_SUCCESS";
export const ASSIGN_IA_FAILURE = "ASSIGN_IA_FAILURE";

export const fetchIAs = () => async (dispatch) => {
  dispatch({ type: FETCH_IAS_REQUEST });
  try {
    const response = await axios.get("https://manual-grader-backend.onrender.com/api/auth/get-ia",{withCredentials:true}); // Fetch IAs from backend
    dispatch({ type: FETCH_IAS_SUCCESS, payload: response.data });
    
  } catch (error) {
    dispatch({ type: FETCH_IAS_FAILURE, payload: error.message });
    toast.error(error.response?.data?.error || "Error fetching IAs");
  }
};

export const assignIAs = (assessId, iaAssignments) => async (dispatch) => {
  try {
    const response = await axios.post("https://manual-grader-backend.onrender.com/api/submissions/assign-ia", { assessId, iaAssignments },{withCredentials:true});
    dispatch({ type: ASSIGN_IA_SUCCESS, payload: response.data });
    toast.success("IA Assigned Successfully!");
  } catch (error) {
    dispatch({ type: ASSIGN_IA_FAILURE, payload: error.message });
    toast.error(error.response?.data?.error || "Error assigning IAs"); // ❌ Error Toast
  }
};
