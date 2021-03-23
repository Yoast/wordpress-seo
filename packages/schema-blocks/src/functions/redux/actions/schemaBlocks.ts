import { BlockValidationResult } from "../../../core/validation";

const PREFIX = "WPSEO_";

export const SchemaBlocksStoreActions = {
	ADD_BLOCK_VALIDATION: `${ PREFIX }ADD_BLOCK_VALIDATION`,
	RESET_BLOCK_VALIDATIONS: `${ PREFIX }CLEAR_BLOCK_VALIDATIONS`,
};

/**
 * Updates whether a block is valid.
 *
 * @param {blockValidationResult} blockValidationResult The block validation to store.
 *
 * @returns {Object} An action for redux.
 */
export function addBlockValidation( blockValidationResult: BlockValidationResult ): object {
	return {
		type: SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION,
		validation: blockValidationResult,
	};
}

/**
 * Commands the store to reset the block validation store to initial state.
 * @returns {object} The command to set the initial state for the block validation store.
 */
export function resetBlockValidation(): object {
	return {
		type: SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS,
	};
}
