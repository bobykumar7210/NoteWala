import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { rootReducer } from "./reducers/rootReducer";

/**
 * Traditional Redux Store creation with Thunk middleware
 */
export const store = createStore(rootReducer, applyMiddleware(thunk));
