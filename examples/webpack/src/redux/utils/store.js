// External dependencies.
import { createStore } from "redux";

// Internal dependencies.
import configureEnhancers from "./configureEnhancers";
import rootReducer from "../reducers/rootReducer";

/**
 * Creates a Redux store.
 *
 * @param {Object} [preloadedState] The initial state.
 *
 * @returns {Object} The Redux store.
 */
function configureStore( preloadedState = {} ) {
	const enhancers = configureEnhancers();

	return createStore( rootReducer, preloadedState, enhancers );
}

export default configureStore;
