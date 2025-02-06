const initialState = {
    loading: false,
    error: null,
    successMessage: null,
  };
  
  export const submissionUploadReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPLOAD_CSV_REQUEST':
        return { ...state, loading: true };
      case 'UPLOAD_CSV_SUCCESS':
        return { loading: false, successMessage: action.payload.message };
      case 'UPLOAD_CSV_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };