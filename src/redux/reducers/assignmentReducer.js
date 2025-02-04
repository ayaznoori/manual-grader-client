import {
    FETCH_ASSIGNMENTS_REQUEST,
    FETCH_ASSIGNMENTS_SUCCESS,
    FETCH_ASSIGNMENTS_FAILURE,
    CREATE_ASSIGNMENT_SUCCESS,
    DELETE_ASSIGNMENT_SUCCESS,
  } from "../actions/assignmentAction";
  
  const initialState = {
    assignments: [],
    loading: false,
    error: null,
  };
  
  const assignmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ASSIGNMENTS_REQUEST:
        return { ...state, loading: true };
  
      case FETCH_ASSIGNMENTS_SUCCESS:
        return { ...state, loading: false, assignments: action.payload };
  
      case FETCH_ASSIGNMENTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case CREATE_ASSIGNMENT_SUCCESS:
        return { ...state, assignments: [...state.assignments, action.payload] };
  
      case DELETE_ASSIGNMENT_SUCCESS:
        return {
          ...state,
          assignments: state.assignments.filter((a) => a._id !== action.payload),
        };
  
      default:
        return state;
    }
  };
  
  export default assignmentReducer;
  