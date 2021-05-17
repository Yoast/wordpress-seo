import { BlockValidationResult } from "../../core/validation";

/**
 * Gathers all validation issues recursively and flattens them into one list.
 *
 * @param validation The root validation result.
 *
 * @return all validation results.
 */
function getAllDescendantIssues( validation: BlockValidationResult ): BlockValidationResult[] {
	if ( ! validation ) {
		return [];
	}

	let results = [ validation ];
	validation.issues.forEach( issue => {
		results = results.concat( getAllDescendantIssues( issue ) );
	} );

	return results;
}

export default getAllDescendantIssues;
