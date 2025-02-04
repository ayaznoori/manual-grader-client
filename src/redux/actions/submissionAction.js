import axios from "axios";

// Action Types
export const FETCH_SUBMISSIONS_REQUEST = "FETCH_SUBMISSIONS_REQUEST";
export const FETCH_SUBMISSIONS_SUCCESS = "FETCH_SUBMISSIONS_SUCCESS";
export const FETCH_SUBMISSIONS_FAILURE = "FETCH_SUBMISSIONS_FAILURE";

// Fetch Submissions
export const fetchSubmissions = (assessId) => async (dispatch) => {
  dispatch({ type: FETCH_SUBMISSIONS_REQUEST });
  try {
    const response = await axios.get(`http://localhost:5000/api/submissions?assessId=${assessId}`);
    dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_SUBMISSIONS_FAILURE, payload: error.message });
  }
};
