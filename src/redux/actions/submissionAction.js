import axios from "axios";
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

    const { data } = await axios.post('http://localhost:5000/api/submissions/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    dispatch({
      type: 'UPLOAD_CSV_SUCCESS',
      payload: data,
    });
  } catch (error) {
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
    const { data } = await axios.get(`http://localhost:5000/api/submissions/by-assessId/${assessId}`);
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
      const { data } = await axios.get(`http://localhost:5000/api/submissions`);
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

    const { data } = await axios.put(`http://localhost:5000/api/submissions/${submissionId}`, updatedData);

    dispatch({ type: UPDATE_SUBMISSION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_SUBMISSION_FAILURE,
      payload: error.response?.data?.message || "Failed to update submission",
    });
  }
};
