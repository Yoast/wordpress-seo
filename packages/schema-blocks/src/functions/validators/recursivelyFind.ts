import { BlockValidationResult } from "../../core/validation";

/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 * @param source    The validation results to process.
 * @param predicate The predicate that determines wether to filter the validation or not.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
export function recursivelyFind( source: BlockValidationResult[], predicate: ( source: BlockValidationResult ) => boolean ): BlockValidationResult {
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
