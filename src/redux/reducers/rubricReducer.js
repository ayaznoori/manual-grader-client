import {
    FETCH_RUBRICS_REQUEST,
    FETCH_RUBRICS_SUCCESS,
    FETCH_RUBRICS_FAILURE,
    ADD_RUBRIC,
    EDIT_RUBRIC,
    DELETE_RUBRIC,
  } from "../actions/rubricActions";
  
  const initialState = {
    loading: false,
    rubrics: [],
    error: "",
  };
  
  const rubricReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_RUBRICS_REQUEST:
        return { ...state, loading: true };
      case FETCH_RUBRICS_SUCCESS:
        return { ...state, loading: false, rubrics: action.payload };
      case FETCH_RUBRICS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case ADD_RUBRIC:
        return { ...state, rubrics: [...state.rubrics, action.payload] };
      case EDIT_RUBRIC:
        return {
          ...state,
          rubrics: state.rubrics.map((rubric) =>
            rubric._id === action.payload._id ? action.payload : rubric
          ),
        };
      case DELETE_RUBRIC:
        return {
          ...state,
          rubrics: state.rubrics.filter((rubric) => rubric._id !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default rubricReducer;
  