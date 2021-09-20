import { __ } from "@wordpress/i18n";
import { withId } from "@yoast/admin-ui-toolkit/helpers";
import { negate, matchesProperty } from "lodash";

import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, HANDLE_SAVE_ERROR, HANDLE_SAVE_SUCCESS } from "../constants.js";

/**
 * A reducer for the general messages in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function notificationsReducer( state, { type, payload } ) {
	switch ( type ) {
		case ADD_NOTIFICATION:
			return [
				...state,
				withId( payload ),
			];
		case REMOVE_NOTIFICATION:
			return state.filter( negate( matchesProperty( "id", payload ) ) );
		case HANDLE_SAVE_SUCCESS:
			return [
				...state,
				withId( {
					type: "success",
					title: __( "Great! Your optimizations were successfully saved", "admin-ui" ),
					description: payload.isRedirected ? __( "A redirect from the old URL to the new URL was created.", "admin-ui" ) : "",
					autoDismiss: 5000,
				} ),
			];
		case HANDLE_SAVE_ERROR:
			return [
				...state,
				withId( {
					type: "error",
					title: __( "Oops! Something went wrong while saving.", "admin-ui" ),
				} ),
			];
		default:
			return state;
	}
}
