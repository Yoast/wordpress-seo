/* global ajaxurl */
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

export const ALERT_CENTER_NAME = "alertCenter";

const TOGGLE_ALERT_VISIBILITY = "toggleAlertVisibility";

/**
 * @param {string} id The id of the alert.
 * @param {string} nonce The nonce of the alert.
 * @param {boolean} hidden The hidden state of the alert.
 * @returns {Object} Success or error action object.
 */
export function* toggleAlertStatus( id, nonce, hidden = false ) {
	yield{ type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{ type: TOGGLE_ALERT_VISIBILITY,
			payload: {
				id,
				nonce,
				hidden,
			},
		    };
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.success }`, payload: { id } };
	} catch ( error ) {
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * Toggle alert visibility.
 *
 * @param {object} state The state.
 * @param {string} id The id of the alert to hide.
 *
 * @returns {void}
 */
const toggleAlert = ( state, id ) => {
	const index = state.alerts.findIndex( ( alert ) => alert.id === id );
	if ( index !== -1 ) {
		state.alerts[ index ].dismissed = ! state.alerts[ index ].dismissed;
	}
};

const slice = createSlice( {
	name: ALERT_CENTER_NAME,
	initialState: { alerts: [] },
	reducers: {
		toggleAlert,
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_STATUS.success }`, ( state, { payload: { id } } ) => {
			slice.caseReducers.toggleAlert( state, id );
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const createInitialAlertCenterState = slice.getInitialState;

/**
 * Base selector to get the alerts from the state.
 *
 * @param {object} state The state.
 * @returns {array} The alerts.
 */
const selectAlerts = ( state ) => get( state, "alertCenter.alerts", [] );

export const alertCenterSelectors = {
	selectActiveProblems: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "error" && ! alert.dismissed )
	),
	selectDismissedProblems: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "error" && alert.dismissed )
	),
	selectActiveNotifications: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "warning" && ! alert.dismissed )
	),
	selectDismissedNotifications: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "warning" && alert.dismissed )
	),
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
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			body: formData.toString(),
		} );
	},
};

export default slice.reducer;
