import { select } from "@wordpress/data";
import { get } from "lodash";
import { BlockValidationResult } from "../../core/validation";
import { BlockValidation } from "../../core/validation/BlockValidation";

const warningTemplates: Record<number, string> = {
	[ BlockValidation.MissingBlock ]: "A {parent} {child} is {status} but missing.",
	[ BlockValidation.MissingAttribute ]: "A {parent} {child} is empty.",
};


/**
 * Gets the validation results from the store for a blockinstance with the given clientId.
 *
 * @param clientId The clientId to request validation results for.
 * @returns {BlockValidationResult} The validation results, or null if none were found.
 */
function getValidationResult( clientId: string ): BlockValidationResult | null {
	return select( "yoast-seo/editor" ).getValidationResult( clientId );
}

/**
 * Transforms a template into a warning message given validation details.
 *
 * @param parent The parent name.
 * @param issue Details about the current issue.
 *
 *  @returns {string} The presentable warning message appropriate for this issue.
 */
function replaceVariables( parent: string, issue: {name: string; result: BlockValidation; status: string } ) {
	let warning = get( warningTemplates, "[ " + issue.result + " ]", "" );
	warning = warning.replace( "{parent}", parent )
		.replace( "{child}", issue.name )
		.replace( "{status}", issue.status );
	return warning;
}

/**
 * Converts the validation results for a blockinstance with the given clientId to a presentable text.
 *
 * @param clientId   The clientId to request validation results for.
 *
 * @returns {string} The presentable warning message, or null if no warnings are found.
 */
export function getWarnings( clientId: string ): string[] {
	const validation = getValidationResult( clientId );
	if ( ! validation || ! ( validation.result in warningTemplates ) ) {
		return null;
	}

	const parent = validation.name;

	const issues = validation.issues.map( ( issue ) => ( {
		name: issue.name,
		result: issue.result,
		status: "required",
	} ) );

	return issues.map( issue => replaceVariables( parent, issue ) );
}
