import { BlockValidationResult } from "../../core/validation";

export type SchemaBlocksState = {
	validations: Record<string, BlockValidationResult>;
};

export const SchemaBlocksDefaultState: SchemaBlocksState = {
	validations: {},
};
