import { legacy_createStore, applyMiddleware , combineReducers} from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducer";
import assignmentReducer from "./reducers/assignmentReducer";
import submissionReducer from "./reducers/submissionReducer";
import rubricReducer from "./reducers/rubricReducer";
import { iaReducer } from "./reducers/iaReducer";
import { submissionUploadReducer } from "./reducers/uploadSubReducer";

const rootReducer= combineReducers({
    auth:authReducer,
    assignments: assignmentReducer,
    submissions: submissionReducer, 
    rubrics:rubricReducer,
    ia:iaReducer,
    uploadSubmission:submissionUploadReducer
})

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;
