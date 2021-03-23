import { BlockValidationResult } from "../../core/validation";

export type SchemaBlocksAction = {
	type: string;
	validation: BlockValidationResult;
}
