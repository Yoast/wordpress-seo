import { createSelector, createSlice } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";
import { STORE_NAME } from "../constants";

export const ALERT_CENTER_NAME = "alertCenter";

const TOGGLE_ALERT_VISIBILITY = "toggleAlertVisibility";

/**
 * @param {string} id The id of the alert.
 * @param {string} nonce The nonce of the alert.
 * @param {boolean} hidden The hidden state of the alert.
 * @returns {Object} Success or error action object.
 */
function* toggleAlertStatus( id, nonce, hidden = false ) {
	yield{ type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{
			type: TOGGLE_ALERT_VISIBILITY,
			payload: {
				id,
				nonce,
				hidden,
			},
		};
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.success }`, payload: { id } };
	} catch ( error ) {
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.error }`, payload: { id } };
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

/**
 * Sets an error in case of unsuccessful toggling..
 *
 * @param {object} state The state.
 * @param {string} id The id of the alert that generated the error..
 *
 * @returns {void}
 */
const setAlertToggleError = ( state, id ) => {
	const index = state.alerts.findIndex( ( alert ) => alert.id === id );
	if ( index === -1 ) {
		state.alertToggleError = null;
	} else {
		state.alertToggleError = state.alerts[ index ];
	}
};

const slice = createSlice( {
	name: ALERT_CENTER_NAME,
	initialState: { alertToggleError: null, alerts: [] },
	reducers: {
		toggleAlert,
		setAlertToggleError,
		/**
		 * @param {Object} state The state of the slice.
		 * @param {string} id The ID of the alert to remove.
		 * @returns {void}
		 */
		removeAlert( state, { payload: id } ) {
			state.alerts = state.alerts.filter( ( alert ) => alert.id !== id );
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload: { id } } ) => {
			slice.caseReducers.toggleAlert( state, id );
		} );
		builder.addCase( `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload: { id } } ) => {
			slice.caseReducers.setAlertToggleError( state, id );
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialAlertCenterState = slice.getInitialState;

/**
 * Base selector to get the alerts from the state.
 *
 * @param {object} state The state.
 * @returns {array} The alerts.
 */
const selectAlerts = ( state ) => get( state, `${ ALERT_CENTER_NAME }.alerts`, [] );

const selectActiveAlerts = createSelector(
	[ selectAlerts ],
	( alerts ) => alerts.filter( ( alert ) => ! alert.dismissed )
);

/**
 * Selector to get the alert toggle error.
 *
 * @param {object} state The state.
 * @returns {string}  id The id of the alert which caused the error..
 */
const selectAlertToggleError = ( state ) => get( state, `${ ALERT_CENTER_NAME }.alertToggleError`, null );

export const alertCenterSelectors = {
	selectActiveProblems: createSelector(
		[ selectActiveAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "error" )
	),
	selectDismissedProblems: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "error" && alert.dismissed )
	),
	selectActiveNotifications: createSelector(
		[ selectActiveAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "warning" )
	),
	selectDismissedNotifications: createSelector(
		[ selectAlerts ],
		( alerts ) => alerts.filter( ( alert ) => alert.type === "warning" && alert.dismissed )
	),
	selectAlertToggleError,
	selectAlert: createSelector(
		[
			selectAlerts,
			( state, id ) => id,
		],
		( alerts, id ) => alerts.find( ( alert ) => alert.id === id )
	),
	selectActiveAlertsCount: createSelector(
		[ selectActiveAlerts ],
		( alerts ) => alerts.length
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

		const ajaxUrl = select( STORE_NAME ).selectPreference( "ajaxUrl" );

		const response = await fetch( ajaxUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			body: formData.toString(),
		} );

		if ( ! response.ok ) {
			throw new Error( "Failed to dismiss notification" );
		}
	},
};

export const alertCenterReducer = slice.reducer;
