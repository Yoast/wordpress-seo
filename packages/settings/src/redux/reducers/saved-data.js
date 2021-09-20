import { merge } from "lodash";
import { HANDLE_SAVE_SUCCESS } from "../constants.js";

/**
 * Reducer to keep track of the data changes.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @param {string} action.type The action type.
 * @param {*} action.payload The action payload.
 *
 * @returns {Object} The new state.
 */
export default function savedData( state, { type, payload } ) {
	switch ( type ) {
		case HANDLE_SAVE_SUCCESS:
			return merge( {}, payload.data );

		default:
			return state;
	}
}
