import { set } from "lodash";

import {
	HANDLE_SAVE_REQUEST,
	REPLACE_ARRAY_DATA,
	SET_ALL_DATA,
	SET_DATA,
	TOGGLE_DATA,
} from "../constants.js";

/**
 * Reducer to keep track of the which form fields have been touched after save REQUEST.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @param {string} action.type The action type.
 * @param {*} action.payload The action payload.
 *
 * @returns {Object} The new state.
 */
export default function touchedData( state, { type, payload } ) {
	switch ( type ) {
		case HANDLE_SAVE_REQUEST:
		case SET_ALL_DATA:
			return {};
		case REPLACE_ARRAY_DATA:
		case SET_DATA:
		case TOGGLE_DATA:
			return set( { ...state }, payload.path, true );
		default:
			return state;
	}
}
