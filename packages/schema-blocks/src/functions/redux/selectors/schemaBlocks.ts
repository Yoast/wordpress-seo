import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";
import { BlockValidationResult } from "../../../core/validation";
import { recursivelyFind } from "../../validators/recursivelyFind";
import { flatMap } from "lodash";

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

/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 * @param state    The entire Schema Blocks state.
 * @param clientId The ClientId of the block you want validation results for.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
export function getValidationResultForClientId( state: SchemaBlocksState, clientId: string ): BlockValidationResult {
	const stored = getSchemaBlocksValidationResults( state );
	const validationResults = Object.values( stored );

	return recursivelyFind( validationResults, ( result ) => result.clientId === clientId );
}

/**
 * Finds all validation results for innerblocks that match the names of given blocks.
 * @param state      The entire Schema Blocks state.
 * @param clientId   The clientId of the parent block containing the Innerblocks, e.g. the job posting id.
 * @param blockNames the set of blocknames you're looking for.
 * @returns The innerblock's validation.
 */
export function getInnerblockValidations( state: SchemaBlocksState, clientId: string, blockNames?: string[] ): BlockValidationResult[] {
	const validation = getValidationResultForClientId( state, clientId );
	if ( ! validation || validation.issues.length <= 0 ) {
		return [];
	}

	return flatMap( validation.issues, issue => issue.issues.filter( ( result ) => blockNames.includes( result.name ) ) );
}

