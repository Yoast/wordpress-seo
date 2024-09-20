import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const TOGGLE_ALERT_VISIBILITY = "TOGGLE_ALERT_VISIBILITY";

/**
 * @param {string} id The id of the alert.
 * @returns {Object} Success or error action object.
 */
export function* toggleAlertStatus( id ) {
	try {
		const data = yield { type: TOGGLE_ALERT_VISIBILITY,
                payload: {
                    id,
                },
		    };
		return { type: `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.success }`, payload: data };
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
 * @param {string} type The type of the alert.
 * @param {string} target The target visability of the alert.
 * @param {string} id The id of the alert to hide.
 *
 * @returns {void}
 */
const changeAlertVisibility = ( state, type, target, id ) => {
	const statuses = [ "active", "dismissed" ];
	const source = statuses.find( ( status ) => status !== target );

	const alertToShow = state[ type ][ source ].find( ( alert ) => alert.id === id );
	if ( alertToShow ) {
		state[ type ][ source ] = state[ type ].active.filter( ( alert ) => alert.id !== id );
		state[ type ][ target ].push( alertToShow );
	}
};

const slice = createSlice( {
	name: "alertCenter",
	initialState: createInitialAlertCenterState(),
    extraReducers: ( builder ) => {
        builder.addCase( `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_STATUS.success }`, ( state, { payload: { id, type, target } } ) => {
			changeAlertVisibility( state, type, target, id );
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
	[ TOGGLE_ALERT_VISIBILITY ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/toggle-alert-status",
		method: "POST",
		data: {
            id: payload.id,
        }
	} ),
};

export default slice.reducer;
