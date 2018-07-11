// External dependencies.
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import flowRight from "lodash/flowRight";

/**
 * Configures the Redux store enhancers.
 *
 * @returns {Object} Redux store enhancers.
 */
export default function configureEnhancers() {
	const middleware = [
		thunk,
	];

	const enhancers = [
		applyMiddleware( ...middleware ),
	];

	if ( window.__REDUX_DEVTOOLS_EXTENSION__ ) {
		enhancers.push( window.__REDUX_DEVTOOLS_EXTENSION__() );
	}

	return flowRight( enhancers );
}
