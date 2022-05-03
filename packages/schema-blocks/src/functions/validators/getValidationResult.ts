import { BlockValidationResult } from "../../core/validation";
import { select } from "@wordpress/data";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";

type clientIdValidation = Record<string, BlockValidationResult>;

/**
 * Gets the validation results from the store for a block instance with the given clientId.
 *
 * @param clientId The clientId to request validation results for.
 *
 * @returns The validation results, or null if none were found.
 */
export function getValidationResults(): BlockValidationResult[] {
	const validationResults: clientIdValidation = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getSchemaBlocksValidationResults();
	if ( ! validationResults ) {
		return [];
	}

	const validations: BlockValidationResult[] = Object.values( validationResults );
	return validations;
}

/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 * @param clientId The ClientId of the block you want validation results for.
 * @param validationResults The (partial) ValidationResult tree to investigate; reads the entire tree from the store by default.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
export function getValidationResultForClientId( clientId: string, validationResults?: BlockValidationResult[] ): BlockValidationResult {
	if ( ! validationResults ) {
		validationResults = getValidationResults();
	}

	for ( const validationResult of validationResults ) {
		// When the validation result matches the client id, return it.
		if ( validationResult.clientId === clientId ) {
			return validationResult;
		}

		// Just keep driving down the tree calling until we have found the result.
		if ( validationResult.issues.length > 0 ) {
			const validation = getValidationResultForClientId( clientId, validationResult.issues );
			if ( validation ) {
				return validation;
			}
		}
	}

	// We haven't found the result down this tree.
	return null;
}
