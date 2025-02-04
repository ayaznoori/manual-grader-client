import {
    FETCH_SUBMISSIONS_REQUEST,
    FETCH_SUBMISSIONS_SUCCESS,
    FETCH_SUBMISSIONS_FAILURE,
  } from "../actions/submissionAction";
  
  const initialState = {
    submissions: [],
    loading: false,
    error: null,
  };
  
  const submissionReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SUBMISSIONS_REQUEST:
        return { ...state, loading: true };
  
      case FETCH_SUBMISSIONS_SUCCESS:
        return { ...state, loading: false, submissions: action.payload };
  
      case FETCH_SUBMISSIONS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default submissionReducer;
  