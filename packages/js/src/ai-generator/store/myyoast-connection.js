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

export const myyoastConnectionSelectors = {
	selectMyyoastConnection: state => get( state, MYYOAST_CONNECTION_NAME, getInitialMyyoastConnectionState() ),
};

export const myyoastConnectionActions = slice.actions;

export const myyoastConnectionReducer = slice.reducer;
