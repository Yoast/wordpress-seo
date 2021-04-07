import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";

/**
 * The schema validation results.
 *
 * @param {object} state The current state.
 *
 * @returns {Record<string, BlockValidationResult>} The schema blocks validation results.
 */
export function getSchemaBlocksValidationResults( state: SchemaBlocksState ): object {
	return state.validations || SchemaBlocksDefaultState.validations;
}
