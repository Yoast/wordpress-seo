import { BlockValidationResult } from "../../core/validation";

const PREFIX = "WPSEO_";

export const SchemaBlocksStoreActions = {
	ADD_BLOCK_VALIDATION: `${ PREFIX }ADD_BLOCK_VALIDATION`,
	RESET_BLOCK_VALIDATIONS: `${ PREFIX }CLEAR_BLOCK_VALIDATIONS`,
};

export type SchemaBlocksStoreAction = {
	type: string;
	validation: BlockValidationResult;
}
