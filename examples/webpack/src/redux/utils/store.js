// External dependencies.
import { createStore } from "redux";

// Internal dependencies.
import configureEnhancers from "./configureEnhancers";
import rootReducer from "../reducers/rootReducer";

/**
 * Creates a Redux store.
 *
 * @param {Object} [preloadedState]  The initial state.
 * @param {Array}  [extraMiddleware] Any extra middleware to apply.
 *
 * @returns {Object} The Redux store.
 */
function configureStore( preloadedState = {}, extraMiddleware = [] ) {
	const enhancers = configureEnhancers( extraMiddleware );

	return createStore( rootReducer, preloadedState, enhancers );
}

export default configureStore;
