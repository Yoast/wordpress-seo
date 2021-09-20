/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import { getDeepestObjectValues, withId } from "@yoast/admin-ui-toolkit/helpers";
import { matchesProperty, negate } from "lodash";

import {
	ADD_NOTIFICATION, APPLY_THEME_MODIFICATIONS_ERROR,
	APPLY_THEME_MODIFICATIONS_SUCCESS,
	HANDLE_SAVE_ERROR,
	HANDLE_SAVE_SUCCESS,
	REMOVE_NOTIFICATION, REMOVE_THEME_MODIFICATIONS_ERROR,
	REMOVE_THEME_MODIFICATIONS_SUCCESS,
} from "../constants.js";

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
					title: __( "Great! Your settings were successfully saved", "admin-ui" ),
					autoDismiss: 5000,
				} ),
			];
		case HANDLE_SAVE_ERROR:
			return [
				...state,
				withId( {
					type: "error",
					title: __( "Oops! Something went wrong while saving:", "admin-ui" ),
					description: getDeepestObjectValues( payload.errors ),
				} ),
			];

		case APPLY_THEME_MODIFICATIONS_SUCCESS:
			return [
				...state,
				withId( {
					type: "success",
					title: __( "Theme modifications successfully reapplied!", "admin-ui" ),
				} ),
			];
		case APPLY_THEME_MODIFICATIONS_ERROR:
			return [
				...state,
				withId( {
					type: "error",
					title: __( "Oops! Something went wrong while reapplying your theme modifications", "admin-ui" ),
					description: payload,
				} ),
			];
		case REMOVE_THEME_MODIFICATIONS_SUCCESS:
			return [
				...state,
				withId( {
					type: "success",
					title: __( "Theme modifications successfully removed!", "admin-ui" ),
				} ),
			];
		case REMOVE_THEME_MODIFICATIONS_ERROR:
			return [
				...state,
				withId( {
					type: "error",
					title: __( "Oops! Something went wrong while removing your theme modifications", "admin-ui" ),
					description: payload,
				} ),
			];

		default:
			return state;
	}
}
