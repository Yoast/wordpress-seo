import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

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
	reducers: {
		hideNotification: ( state, action ) => {
			changeAlertVisibility( state, "notifications", "dismissed", action.payload );
		},
		hideProblem: ( state, action ) => {
			changeAlertVisibility( state, "problems", "dismissed", action.payload );
		},
		showNotification: ( state, action ) => {
			changeAlertVisibility( state, "notifications", "active", action.payload );
		},
		showProblem: ( state, action ) => {
			changeAlertVisibility( state, "problems", "active", action.payload );
		},
	},
} );

export const alertCenterSelectors = {
	selectActiveProblems: ( state ) => get( state, "alertCenter.problems.active", [] ),
	selectDismissedProblems: ( state ) => get( state, "alertCenter.problems.dismissed", [] ),
	selectActiveNotifications: ( state ) => get( state, "alertCenter.notifications.active", [] ),
	selectDismissedNotifications: ( state ) => get( state, "alertCenter.notifications.dismissed", [] ),
};

export const alertCenterActions = slice.actions;

export default slice.reducer;
