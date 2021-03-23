import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";
import { SchemaBlocksStoreAction, SchemaBlocksStoreActions } from "../SchemaBlocksAction";

/**
 * A reducer for the Schema blocks.
 *
 * @param {SchemaBlocksState} state  The current state of the object.
 * @param {SetBlockValidation} action The received action.
 *
 * @returns {Object} The state.
 */
export function schemaBlocksReducer( state: SchemaBlocksState = SchemaBlocksDefaultState, action: SchemaBlocksStoreAction ): SchemaBlocksState {
	switch ( action.type ) {
		case SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS: {
			return SchemaBlocksDefaultState;
		}
		case SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION: {
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
