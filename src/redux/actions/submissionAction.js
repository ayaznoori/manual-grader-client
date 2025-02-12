import axios from "axios";
import { toast } from "react-toastify";
export const FETCH_SUBMISSIONS_REQUEST = "FETCH_SUBMISSIONS_REQUEST";
export const FETCH_SUBMISSIONS_SUCCESS = "FETCH_SUBMISSIONS_SUCCESS";
export const FETCH_SUBMISSIONS_FAILURE = "FETCH_SUBMISSIONS_FAILURE";

export const UPDATE_SUBMISSION_REQUEST = "UPDATE_SUBMISSION_REQUEST";
export const UPDATE_SUBMISSION_SUCCESS = "UPDATE_SUBMISSION_SUCCESS";
export const UPDATE_SUBMISSION_FAILURE = "UPDATE_SUBMISSION_FAILURE";

export const bulkUploadCSV = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append('csvFile', file);

  try {
    dispatch({ type: 'UPLOAD_CSV_REQUEST' });

    const { data } = await axios.post('https://manual-grader-backend.onrender.com/api/submissions/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    },{withCredentials:true});
    toast.success("Bulk Uploaded Successfully!");
    dispatch({
      type: 'UPLOAD_CSV_SUCCESS',
      payload: data,
    });
  } catch (error) {
    toast.error("Bulk upload failed");
    dispatch({
      type: 'UPLOAD_CSV_FAIL',
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};


// Fetch Submissions Action
export const fetchSubmissions = (assessId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SUBMISSIONS_REQUEST });
    const { data } = await axios.get(`https://manual-grader-backend.onrender.com/api/submissions/by-assessId/${assessId}`,{withCredentials:true});
    dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_SUBMISSIONS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch submissions",
    });
  }
};
export const fetchSubmissionsAll = () => async (dispatch) => {
    try {
      dispatch({ type: FETCH_SUBMISSIONS_REQUEST });
      const { data } = await axios.get(`https://manual-grader-backend.onrender.com/api/submissions`);
      dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_SUBMISSIONS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch submissions",
      });
    }
  };

// Update Submission Action
export const updateSubmission = (submissionId, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUBMISSION_REQUEST });

    const { data } = await axios.put(`https://manual-grader-backend.onrender.com/api/submissions/${submissionId}`, updatedData,{withCredentials:true});

    dispatch({ type: UPDATE_SUBMISSION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_SUBMISSION_FAILURE,
      payload: error.response?.data?.message || "Failed to update submission",
    });
  }
};

export const updateIA = (submissionId, newIaId) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_IA_REQUEST" });
    const { data } = await axios.put("https://manual-grader-backend.onrender.com/api/submissions/update/ia", {
      submissionId,
      newIaId,
    },{withCredentials:true});

    dispatch({ type: "UPDATE_IA_SUCCESS", payload: data.submission });
    } catch (error) {
    console.error("Failed to update IA:", error.response?.data?.error);
    dispatch({
      type: "UPDATE_IA_FAILURE",
      payload: error.response?.data?.error || "Failed to update IA",
    });
  }
};

