/* External dependencies */
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import flowRight from "lodash/flowRight";

/**
 * Returns redux store enhancers.
 *
 * @returns {Object} Redux store enhancers.
 */
export default function configureEnhancers() {
	const middleware = [
		thunk,
	];

	if ( process.env.NODE_ENV !== "production" ) {
		middleware.push( logger );
	}

	const enhancers = [
		applyMiddleware( ...middleware ),
	];

	if ( window.__REDUX_DEVTOOLS_EXTENSION__ ) {
		enhancers.push( window.__REDUX_DEVTOOLS_EXTENSION__() );
	}

	return flowRight( enhancers );
}
