import axios from "axios";
export const FETCH_RUBRICS_REQUEST = "FETCH_RUBRICS_REQUEST";
export const FETCH_RUBRICS_SUCCESS = "FETCH_RUBRICS_SUCCESS";
export const FETCH_RUBRICS_FAILURE = "FETCH_RUBRICS_FAILURE";
export const ADD_RUBRIC = "ADD_RUBRIC";
export const EDIT_RUBRIC = "EDIT_RUBRIC";
export const DELETE_RUBRIC = "DELETE_RUBRIC";

// Fetch rubrics by assessId
export const fetchRubrics = (assessId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_RUBRICS_REQUEST });

    const { data } = await axios.get(`http://localhost:5000/api/rubrics/by-assessId/${assessId}`);

    dispatch({
      type: FETCH_RUBRICS_SUCCESS,
      payload: data, // Array of rubrics
    });
  } catch (error) {
    dispatch({
      type: FETCH_RUBRICS_FAILURE,
      payload: error.response?.data?.error || "Failed to fetch rubrics",
    });
  }
};

export const createRubric = (assignmentId, rubricData) => async (dispatch) => {
    try {
      await axios.post("http://localhost:5000/api/rubrics/create", { assignmentId, ...rubricData });
      dispatch(fetchRubrics(assignmentId)); // Refresh rubrics
      toast.success("Rubric added successfully!");
    } catch (error) {
      toast.error("Error adding rubric.");
    }
  };
 // Edit an Existing Rubric
export const editRubric = (rubricId, criteria, marks) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/rubrics/${rubricId}`, { criteria, marks });
    dispatch({ type: EDIT_RUBRIC, payload: response.data });
  } catch (error) {
    console.error("Failed to edit rubric", error);
  }
};

// Delete a Rubric
export const deleteRubric = (rubricId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/rubrics/${rubricId}`);
    dispatch({ type: DELETE_RUBRIC, payload: rubricId });
  } catch (error) {
    console.error("Failed to delete rubric", error);
  }
};
export const deleteRubricById = (assessId) => async (dispatch) => {
    try {
      dispatch({ type: FETCH_RUBRICS_REQUEST });
  
      const { data } = await axios.get(`http://localhost:5000/api/rubrics/by-assessId/${assessId}`);
  
      dispatch({
        type: FETCH_RUBRICS_SUCCESS,
        payload: data, // Array of rubrics
      });
    } catch (error) {
      dispatch({
        type: FETCH_RUBRICS_FAILURE,
        payload: error.response?.data?.error || "Failed to fetch rubrics",
      });
    }
  };