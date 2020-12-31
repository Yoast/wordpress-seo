import { SET_BLOCK_VALID } from "../actions/setBlockValidation";

const initialState = {};

/**
 * A reducer for the Schema blocks.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
export function schemaBlocksReducer( state = initialState, action:any ) {
	switch ( action.type ) {
		case SET_BLOCK_VALID: {
			const validationResult = { [ action.clientId ]: action.validation };
			// Make a shallow copy of the state and overwrite the validation result of the block.
			return Object.assign( {}, state, validationResult );
		}
		default: {
			return state;
		}
	}
}
