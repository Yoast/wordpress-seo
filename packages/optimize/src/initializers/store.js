import { createReduxStore, register } from "@wordpress/data";
import { OPTIMIZE_STORE_KEY } from "../constants";
import * as actions from "../redux/actions";
import createControls from "../redux/controls";
import reducer from "../redux/reducers";
import * as selectors from "../redux/selectors";

/**
 * Initializes the optimize store.
 *
 * @param {Object} initialState Initial state for Redux store.
 * @param {Object} controls The functions to create controls from.
 *
 * @returns {void}
 */
export default function initializeStore( initialState = {}, controls ) {
	const store = createReduxStore( OPTIMIZE_STORE_KEY, {
		reducer,
		selectors,
		actions,
		initialState,
		controls: createControls( controls ),
	} );

	register( store );
}
