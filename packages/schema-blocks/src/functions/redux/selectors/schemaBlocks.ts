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
export function getValidationResults( state: SchemaBlocksState ): ClientIdValidation {
	return state.validations || SchemaBlocksDefaultState.validations;
}


/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 * @param state    The entire Schema Blocks state.
 * @param clientId The ClientId of the block you want validation results for.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
export function getValidationResultForClientId( state: SchemaBlocksState, clientId: string ): BlockValidationResult {
	const stored = getValidationResults( state );
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
export function getInnerblockValidations( state: SchemaBlocksState, clientId: string, blockNames?: string[] ) {
	const validation = getValidationResultForClientId( state, clientId );
	if ( ! validation || validation.issues.length <= 0 ) {
		return null;
	}
	return recursivelyFind( validation.issues, ( result ) => blockNames.includes( result.name ) );
}

/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 * @param source    The validation results to process.
 * @param predicate The predicate that determines wether to filter the validation or not.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
function recursivelyFind( source: BlockValidationResult[], predicate: ( source: BlockValidationResult ) => boolean ): BlockValidationResult {
	for ( const validationResult of source ) {
		// When the validation result matches the client id, return it.
		if ( predicate( validationResult ) ) {
			return validationResult;
		}

		// Just keep driving down the tree calling until we have found the result.
		if ( validationResult.issues.length > 0 ) {
			const validation = recursivelyFind( validationResult.issues, predicate );
			if ( validation ) {
				return validation;
			}
		}
	}
	// We haven't found the result down this tree.
	return null;
}
