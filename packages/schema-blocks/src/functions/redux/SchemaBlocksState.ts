import { BlockValidationResult } from "../../core/validation";


export const YOAST_SCHEMA_STORE_NAME = "yoast-seo/schema-blocks";

export type SchemaBlocksState = {
	validations: Record<string, BlockValidationResult>;
};

export const SchemaBlocksDefaultState: SchemaBlocksState = {
	validations: {},
};
