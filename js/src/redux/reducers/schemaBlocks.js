import * as actions from "../actions/schemaBlocks";

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
		case actions.RESET_BLOCK_VALIDATIONS: {
			return initialState;
		}
		case actions.ADD_BLOCK_VALIDATION: {
			const newState = Object.assign( {}, state );
			const validation = action.validation;

			newState.validations = newState.validations || {};
			newState.validations[ validation.clientId ] = validation;

			return newState;
		}
		default: {
			return state;
		}
	}
}
