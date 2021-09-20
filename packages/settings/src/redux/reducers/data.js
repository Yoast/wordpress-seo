import { get, merge } from "lodash";
import { mergePathToState } from "@yoast/admin-ui-toolkit/helpers";

import { REPLACE_ARRAY_DATA, SET_ALL_DATA, SET_DATA, TOGGLE_DATA } from "../constants.js";

/**
 * A reducer for the data in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function dataReducer( state, { type, payload } ) {
	let toggleState;

	switch ( type ) {
		case SET_ALL_DATA:
			return merge( {}, payload );
		case REPLACE_ARRAY_DATA:
			return mergePathToState( state, payload.path, payload.value, { arrayMerge: "replace" } );
		case SET_DATA:
			return mergePathToState( state, payload.path, payload.value );
		case TOGGLE_DATA:
			toggleState = get( state, payload.path, null );
			if ( toggleState === null ) {
				console.warn( "You have supplied a non-existent path to the redux action: ", payload.path );
				return state;
			}
			return mergePathToState( state, payload.path, ! toggleState );
		default:
			return state;
	}
}
