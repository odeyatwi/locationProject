import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import crashReporter from "./ErrorHandler";

const store = createStore(reducers,{},applyMiddleware(crashReporter,thunk));

export default store;


