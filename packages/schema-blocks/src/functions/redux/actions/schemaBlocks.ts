import { BlockValidationResult } from "../../../core/validation";
import { SchemaBlocksStoreCommand, AddBlockValidationCommand, ResetBlockValidationCommand } from "./";

/**
 * Updates whether a block is valid.
 *
 * @param {blockValidationResult} blockValidationResult The block validation to store.
 *
 * @returns {SchemaBlocksStoreAction} An action for redux.
 */
export function addBlockValidation( blockValidationResult: BlockValidationResult ): SchemaBlocksStoreCommand {
	return AddBlockValidationCommand( blockValidationResult );
}

/**
 * Commands the store to reset the block validation store to initial state.
 * @returns {SchemaBlocksStoreAction} The command to set the initial state for the block validation store.
 */
export function resetBlockValidation(): SchemaBlocksStoreCommand {
	return ResetBlockValidationCommand();
}
