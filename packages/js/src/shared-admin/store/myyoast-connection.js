import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const MYYOAST_CONNECTION_NAME = "myyoastConnection";

const slice = createSlice( {
	name: MYYOAST_CONNECTION_NAME,
	initialState: {
		// Whether the MyYoast connection is available on this build. When false
		// (feature flag off or not provisioned), the editor shows the
		// informational-only "cannot reach your site" notification.
		isAvailable: false,
		// Whether the current user may register/connect this site to MyYoast.
		canConnect: false,
		// The nonce-protected Integrations-page URL that auto-starts the connection
		// flow, or null when the user can't connect.
		connectUrl: null,
		// The "learn more about connecting with MyYoast" outbound link.
		learnMoreUrl: "",
	},
	reducers: {},
} );

export const getInitialMyyoastConnectionState = slice.getInitialState;

/**
 * Maps the raw myyoastConnection window payload to store initial state.
 *
 * @param {Object|null} payload The myyoastConnection value from the window data object, or null when unavailable.
 * @returns {Object} The initial state shape for the myyoastConnection slice.
 */
export const getMyyoastConnectionState = ( payload ) => ( {
	isAvailable: Boolean( payload ) && get( payload, "isProvisioned", false ),
	canConnect: get( payload, "canConnect", false ),
	connectUrl: get( payload, "connectUrl", null ),
	learnMoreUrl: get( payload, "learnMoreUrl", "" ),
} );

export const myyoastConnectionSelectors = {
	selectMyyoastConnection: state => get( state, MYYOAST_CONNECTION_NAME, getInitialMyyoastConnectionState() ),
};

export const myyoastConnectionActions = slice.actions;

export const myyoastConnectionReducer = slice.reducer;
