import { merge } from "lodash";
import { GET_DETAIL_ERROR, GET_DETAIL_SUCCESS } from "../constants.js";
import { defaultInitialState } from "../initial-state";

/**
 * A reducer for the detail metadata in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function detailMetadataReducer( state, { type, payload } ) {
	switch ( type ) {
		case GET_DETAIL_SUCCESS:
			return merge( {}, payload.metadata );

		case GET_DETAIL_ERROR:
			return defaultInitialState.detail.metadata;

		default:
			return state;
	}
}
