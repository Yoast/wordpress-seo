import { SET_BLOCK_VALID } from "../actions/schemaBlocks";

const initialState = {};

/**
 * A reducer for the Schema blocks.
 *
 * @param {Object} state  The current state of the object.
 * @param {SetBlockValidation} action The received action.
 *
 * @returns {Object} The state.
 */
export default function schemaBlocksReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_BLOCK_VALID: {
			const validationResult = { [ action.clientId ]: action.validation };
			return Object.assign( {}, state, validationResult );
		}
		default: {
			return state;
		}
	}
}
