import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { get, merge } from "lodash";
import { MYYOAST_STORE_NAME } from "../constants";
import {
	getInitialMyyoastConnectionState,
	MYYOAST_CONNECTION_NAME,
	myyoastConnectionActions,
	myyoastConnectionControls,
	myyoastConnectionReducer,
	myyoastConnectionSelectors,
	transformStatus,
} from "./myyoast-connection";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * Builds the MyYoast connection store descriptor.
 *
 * The slice state is nested under the `myyoastConnection` key so the selectors
 * keep the same shape they had inside the settings store.
 *
 * @param {Object} initialState Initial state, merged over the slice defaults.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( MYYOAST_STORE_NAME, {
		actions: {
			...myyoastConnectionActions,
		},
		selectors: {
			...myyoastConnectionSelectors,
		},
		controls: {
			...myyoastConnectionControls,
		},
		reducer: combineReducers( {
			[ MYYOAST_CONNECTION_NAME ]: myyoastConnectionReducer,
		} ),
		initialState: merge(
			{},
			{ [ MYYOAST_CONNECTION_NAME ]: getInitialMyyoastConnectionState() },
			initialState
		),
	} );
};

/**
 * Registers the standalone MyYoast connection store, seeded from the
 * `wpseoIntegrationsData.myyoast_connection` payload the integrations page
 * localizes. No-ops when the payload is absent (feature flag disabled) —
 * the card is not rendered in that case either.
 *
 * @returns {void}
 */
export const registerMyyoastStore = () => {
	const data = get( window, "wpseoIntegrationsData.myyoast_connection", null );
	if ( ! data ) {
		return;
	}

	register( createStore( {
		initialState: {
			[ MYYOAST_CONNECTION_NAME ]: {
				status: transformStatus( data.initialStatus ),
				pendingCallbackOutcome: data.callbackOutcome || null,
				linkParams: data.linkParams || {},
				endpoints: data.endpoints || {},
			},
		},
	} ) );
};
