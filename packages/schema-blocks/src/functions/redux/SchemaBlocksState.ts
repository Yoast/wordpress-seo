import { BlockValidationResult } from "../../core/validation";

export interface SchemaBlocksState {
	validations: Record<string, BlockValidationResult>;
}

export const SchemaBlocksDefaultState: SchemaBlocksState = {
	validations: {},
};
