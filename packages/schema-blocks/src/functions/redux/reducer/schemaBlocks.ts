import { SchemaBlocksStoreCommand, SchemaBlocksStoreActions } from "../actions";
import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";

/**
 * A reducer for the Schema blocks.
 *
 * @param state    The current state of the object.
 * @param command The received command.
 *
 * @returns The state.
 */
export function schemaBlocksReducer( state: SchemaBlocksState = SchemaBlocksDefaultState, command: SchemaBlocksStoreCommand ): SchemaBlocksState {
	switch ( command.type ) {
		case SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS: {
			return SchemaBlocksDefaultState;
		}
		case SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION: {
			const newState = Object.assign( {}, state );
			const validation = command.validation;

			newState.validations = newState.validations || {};
			newState.validations[ validation.name ] = validation;

			return newState;
		}
		default: {
			return state;
		}
	}
}
