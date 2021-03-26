import { BlockValidationResult } from "../../core/validation";

/**
 * Gathers all validation issues recursively and flattens them into one list.
 *
 * @param validation The root validation result.
 *
 * @return all validation results.
 */
export function getAllDescendantIssues( validation: BlockValidationResult ): BlockValidationResult[] {
	let results = [ validation ];
	validation.issues.forEach( issue => {
		results = results.concat( getAllDescendantIssues( issue ) );
	} );
	return results;
}
