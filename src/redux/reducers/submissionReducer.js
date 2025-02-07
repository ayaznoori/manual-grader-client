import {
    FETCH_SUBMISSIONS_REQUEST,
    FETCH_SUBMISSIONS_SUCCESS,
    FETCH_SUBMISSIONS_FAILURE,
    UPDATE_SUBMISSION_REQUEST,
    UPDATE_SUBMISSION_SUCCESS,
    UPDATE_SUBMISSION_FAILURE,
  } from "../actions/submissionAction";
  
  const initialState = {
    submissions: [],
    loading: false,
    error: null,
  };
  
  const submissionReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SUBMISSIONS_REQUEST:
        return { ...state, loading: true ,submissions:[]};
  
      case FETCH_SUBMISSIONS_SUCCESS:
        return { ...state, loading: false, submissions: action.payload };
  
      case FETCH_SUBMISSIONS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case UPDATE_SUBMISSION_REQUEST:
        return { ...state, loading: true };
        case UPDATE_SUBMISSION_SUCCESS:
              const updatedSubmissions = state.submissions.map((submission) =>
              submission.submissionId === action.payload.submissionId
                ? { ...submission, ...action.payload } // Update the specific submission
                : submission
            );
            return {
              ...state,
              loading: false,
              submissions: updatedSubmissions,
            };
          
      case UPDATE_SUBMISSION_FAILURE:
        return { ...state, loading: false, error: action.payload };

        case "UPDATE_IA_REQUEST":
            return { ...state, loading: true };
          
          case "UPDATE_IA_SUCCESS":
            return {
              ...state,
              loading: false,
              submissions: state.submissions.map((submission) =>
                submission.submissionId === action.payload.submissionId
                  ? { ...submission, gradedBy: action.payload.gradedBy } // Update IA
                  : submission
              ),
            };
          
          case "UPDATE_IA_FAILURE":
            return { ...state, loading: false, error: action.payload };
          
  
      default:
        return state;
    }
  };
  
  export default submissionReducer;
  