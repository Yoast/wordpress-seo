import { createReduxStore, register } from "@wordpress/data";
import { REDUX_STORE_KEY } from "../constants";
import * as actions from "../redux/actions";
import createControls from "../redux/controls";
import reducer from "../redux/reducers";
import * as selectors from "../redux/selectors";

/**
 * Initializes the settings store.
 *
 * @param {object} initialState Initial state for Redux store.
 * @param {Object} controls The functions to create controls from.
 *
 * @returns {void}
 */
export default function initializeStore( initialState = {}, controls ) {
	const store = createReduxStore( REDUX_STORE_KEY, {
		reducer,
		selectors,
		actions,
		initialState,
		controls: createControls( controls ),
	} );

	register( store );
}
