import { SET_BLOCK_VALID } from "../actions/setBlockValidation";

const initialState = null;

/**
 * A reducer for the Schema blocks.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
export function schemaBlocksReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_BLOCK_VALID:
			return null;
		default:
			return state;
	}
}
