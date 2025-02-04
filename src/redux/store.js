import { legacy_createStore, applyMiddleware , combineReducers} from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducer";
import assignmentReducer from "./reducers/assignmentReducer";
import submissionReducer from "./reducers/submissionReducer";

const rootReducer= combineReducers({
    auth:authReducer,
    assignments: assignmentReducer,
    submissions: submissionReducer, 
})

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;
