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
 * Redux store command to add Block validation result to the store.
 */
export class AddBlockValidationCommand implements SchemaBlocksStoreCommand {
	type: string = SchemaBlocksStoreActions.ADD_BLOCK_VALIDATION;
	validation?: BlockValidationResult;

	/**
	 * Creates an AddBlockValidation command.
	 * @param validation The BlockValidationResult to add.
	 */
	constructor( validation: BlockValidationResult ) {
		this.validation = validation;
	}
}

/**
 * Redux store command to clear current validation data in the store.
 */
export class ResetBlockValidationCommand implements SchemaBlocksStoreCommand {
	type: string = SchemaBlocksStoreActions.RESET_BLOCK_VALIDATIONS;
	validation?: BlockValidationResult = null;

	/**
	 * Creates an ResetBlockValidation command.
	 */
	constructor() {
		this.validation = null;
	}
}

export { schemaBlocksActions };
