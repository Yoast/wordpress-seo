import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";
import { BlockValidationResult } from "../../../core/validation";

export type ClientIdValidation = Record<string, BlockValidationResult>;

/**
 * The schema validation results.
 *
 * @param {object} state The current state.
 *
 * @returns {Record<string, BlockValidationResult>} The schema blocks validation results.
 */
export function getSchemaBlocksValidationResults( state: SchemaBlocksState ): ClientIdValidation {
	return state.validations || SchemaBlocksDefaultState.validations;
}
