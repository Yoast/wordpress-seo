import { BlockValidationResult } from "../../../core/validation";

import * as schemaBlocksActions from "./schemaBlocks";

const PREFIX = "WPSEO_";

export const SchemaBlocksStoreActions = {
	ADD_BLOCK_VALIDATION: `${ PREFIX }ADD_BLOCK_VALIDATION`,
	RESET_BLOCK_VALIDATIONS: `${ PREFIX }CLEAR_BLOCK_VALIDATIONS`,
};

export interface SchemaBlocksStoreCommand {
	type: string;
	validation?: BlockValidationResult;
}

/**
 * Configures a redux command to store a validation result.
 *
 * @param validation The validation to store.
 * @returns The configured AddBlockValidation command.
 */
export function AddBlockValidationCommand( validation: BlockValidationResult ): SchemaBlocksStoreCommand {
	return {
		type: SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION,
		validation: validation,
	};
}

/**
 * Configures a redux command to reset the current validation results.
 *
 * @returns Thge configured ResetBlockValidation command
 */
export function ResetBlockValidationCommand(): SchemaBlocksStoreCommand {
	return {
		type: SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS,
	};
}

export { schemaBlocksActions };
