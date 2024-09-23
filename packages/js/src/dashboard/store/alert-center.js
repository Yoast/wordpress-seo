/* global ajaxurl */
import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";


const TOGGLE_ALERT_VISIBILITY = "TOGGLE_ALERT_VISIBILITY";

/**
 * @param {string} id The id of the alert.
 * @param {string} nonce The nonce of the alert.
 * @param {boolean} hidden The hidden state of the alert.
 * @returns {Object} Success or error action object.
 */
export function* toggleAlertStatus( id, nonce, hidden = false ) {
	try {
		yield{ type: TOGGLE_ALERT_VISIBILITY,
			payload: {
				id,
				nonce,
				hidden,
			},
		    };
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.success }`, payload: { id, hidden } };
	} catch ( error ) {
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialAlertCenterState = () => ( {
	notifications: {
		active: get( window, "wpseoScriptData.notifications.active", [] ),
		dismissed: get( window, "wpseoScriptData.notifications.dismissed", [] ),
	},
	problems: {
		active: get( window, "wpseoScriptData.problems.active", [] ),
		dismissed: get( window, "wpseoScriptData.problems.dismissed", [] ),
	},
} );

/**
 * Change alert visability.
 *
 * @param {object} state The state.
 * @param {boolean} hidden The hidden state of the alert.
 * @param {string} id The id of the alert to hide.
 *
 * @returns {void}
 */
const changeAlertVisibility = ( state, hidden, id ) => {
	const target = hidden ? "active" : "dismissed";
	const source = hidden ? "dismissed" : "active";
	const type = state.problems[ source ].find( ( alert ) => alert.id === id ) ? "problems" : "notifications";
	const alertToShow = state[ type ][ source ].find( ( alert ) => alert.id === id );
	if ( alertToShow ) {
		state[ type ][ source ] = state[ type ][ source ].filter( ( alert ) => alert.id !== id );
		state[ type ][ target ] = [ ...state[ type ][ target ], alertToShow ];
	}
};

const slice = createSlice( {
	name: "alertCenter",
	initialState: createInitialAlertCenterState(),
	extraReducers: ( builder ) => {
		builder.addCase( `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_STATUS.success }`, ( state, { payload: { id, hidden } } ) => {
			changeAlertVisibility( state, hidden, id );
		} );
	},
} );

export const alertCenterSelectors = {
	selectActiveProblems: ( state ) => get( state, "alertCenter.problems.active", [] ),
	selectDismissedProblems: ( state ) => get( state, "alertCenter.problems.dismissed", [] ),
	selectActiveNotifications: ( state ) => get( state, "alertCenter.notifications.active", [] ),
	selectDismissedNotifications: ( state ) => get( state, "alertCenter.notifications.dismissed", [] ),
};

export const alertCenterActions = {
	...slice.actions,
	toggleAlertStatus,
};

export const alertCenterControls = {
	[ TOGGLE_ALERT_VISIBILITY ]: async( { payload } ) => {
		const formData = new URLSearchParams();
		formData.append( "action", payload.hidden ? "yoast_restore_notification" : "yoast_dismiss_notification" );
		formData.append( "notification", payload.id );
		formData.append( "nonce", payload.nonce );

		fetch( ajaxurl, {
			method: "POST",
			headers: {
				"X-WP-Nonce": payload.nonce,
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			credentials: "same-origin",
			body: formData.toString(),
		} );
	},
};

export default slice.reducer;
