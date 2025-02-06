import {
    FETCH_IAS_REQUEST,
    FETCH_IAS_SUCCESS,
    FETCH_IAS_FAILURE,
    ASSIGN_IA_SUCCESS,
    ASSIGN_IA_FAILURE,
  } from "../actions/iaActions";
  
  const initialState = {
    ias: [],
    loading: false,
    error: null,
    assignmentSuccess: null,
  };
  
  export const iaReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_IAS_REQUEST:
        return { ...state, loading: true };
      case FETCH_IAS_SUCCESS:
        return { ...state, loading: false, ias: action.payload?.IAs };
      case FETCH_IAS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case ASSIGN_IA_SUCCESS:
        return { ...state, assignmentSuccess: action.payload };
      case ASSIGN_IA_FAILURE:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  