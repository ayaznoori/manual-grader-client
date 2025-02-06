import axios from "axios";
import { toast } from "react-toastify";

// Action Types
export const FETCH_ASSIGNMENTS_REQUEST = "FETCH_ASSIGNMENTS_REQUEST";
export const FETCH_ASSIGNMENTS_SUCCESS = "FETCH_ASSIGNMENTS_SUCCESS";
export const FETCH_ASSIGNMENTS_FAILURE = "FETCH_ASSIGNMENTS_FAILURE";

export const CREATE_ASSIGNMENT_SUCCESS = "CREATE_ASSIGNMENT_SUCCESS";
export const DELETE_ASSIGNMENT_SUCCESS = "DELETE_ASSIGNMENT_SUCCESS";

// Fetch Assignments
export const fetchAssignments = () => async (dispatch) => {
  dispatch({ type: FETCH_ASSIGNMENTS_REQUEST });
  try {
    const response = await axios.get("http://localhost:5000/api/assignments/all",{withCredentials:true});
    dispatch({ type: FETCH_ASSIGNMENTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ASSIGNMENTS_FAILURE, payload: error.message });
  }
};

// Create Assignment
export const createAssignment = (assignmentData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5000/api/assignments/create", assignmentData,{withCredentials:true});
    dispatch({ type: CREATE_ASSIGNMENT_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error creating assignment:", error);
  }
};

// Delete Assignment
export const deleteAssignment = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/assignments/${id}`);
    dispatch({ type: DELETE_ASSIGNMENT_SUCCESS, payload: id });
  } catch (error) {
    console.error("Error deleting assignment:", error);
  }
};
export const updateAssignment = (id, updatedData) => async (dispatch) => {
    try {
      await axios.put(`http://localhost:5000/api/assignments/${id}`, updatedData,{withCredentials:true});
      dispatch({ type: "UPDATE_ASSIGNMENT_SUCCESS", payload: updatedData });
      toast.success("Assignment updated successfully!");
    } catch (error) {
      toast.error("Error updating assignment.");
    }
  };
