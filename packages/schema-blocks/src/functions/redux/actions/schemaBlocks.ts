import { BlockValidationResult } from "../../../core/validation";
import { SchemaBlocksStoreAction, SchemaBlocksStoreActions } from "../SchemaBlocksAction";

/**
 * Updates whether a block is valid.
 *
 * @param {blockValidationResult} blockValidationResult The block validation to store.
 *
 * @returns {SchemaBlocksStoreAction} An action for redux.
 */
export function addBlockValidation( blockValidationResult: BlockValidationResult ): SchemaBlocksStoreAction {
	return {
		type: SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION,
		validation: blockValidationResult,
	};
}

/**
 * Commands the store to reset the block validation store to initial state.
 * @returns {SchemaBlocksStoreAction} The command to set the initial state for the block validation store.
 */
export function resetBlockValidation(): SchemaBlocksStoreAction {
	return {
		type: SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS,
		validation: null,
	};
}
