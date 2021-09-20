import { GET_DETAIL_SUCCESS, SET_ALL_DATA, HANDLE_SAVE_SUCCESS } from "../constants.js";

/**
 * Reducer to keep track of the original data before it is changed.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @param {string} action.type The action type.
 * @param {*} action.payload The action payload.
 *
 * @returns {Object} The new state.
 */
export default function originalDetailDataReducer( state, { type, payload } ) {
	switch ( type ) {
		case HANDLE_SAVE_SUCCESS:
		case GET_DETAIL_SUCCESS:
			return payload.data;
		case SET_ALL_DATA:
			return payload;
		default:
			return state;
	}
}
