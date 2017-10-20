import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

/**
 * This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
 */

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @returns {Object} Things that need to be exposed, such as the store.
 */
export function initialize() {
	const middleware = [
		thunk,
	];

	if ( process.env.NODE_ENV !== "production" ) {
		middleware.push( logger );
	}

	const rootReducer = combineReducers( {
		analysis: analysis,
	} );
	const store = createStore( rootReducer, {}, applyMiddleware( ...middleware ) );

	return {
		store,
	};
}

export default initialize;
