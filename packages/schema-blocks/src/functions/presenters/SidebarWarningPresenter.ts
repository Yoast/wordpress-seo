import { select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";

import { BlockValidation, BlockValidationResult } from "../../core/validation";
import { getHumanReadableBlockName } from "../BlockHelper";

type clientIdValidation = Record<string, BlockValidationResult>;

/**
 * A warning message for in the sidebar schema analysis.
 */
export type sidebarWarning = {
	/**
	 * The warning message.
	 */
	text: string;
	/**
	 * Color of the warning.
	 */
	color: "red" | "green";
}

/**
 * Gets the validation results from the store for a block instance with the given clientId.
 *
 * @param clientId The clientId to request validation results for.
 *
 * @returns {BlockValidationResult} The validation results, or null if none were found.
 */
function getValidationResult( clientId: string ): BlockValidationResult | null {
	const validationResults: clientIdValidation = select( "yoast-seo/editor" ).getSchemaBlocksValidationResults();
	if ( ! validationResults ) {
		return null;
	}

	return validationResults[ clientId ];
}

/**
 * Adds analysis conclusions to the footer.
 *
 * @param validation The validation result for the current block.
 * @param issues     The detected issues.
 *
 * @returns Any analysis conclusions that should be in the footer.
 */
function getAnalysisConclusion( validation: BlockValidationResult, issues: BlockValidationResult[] ): sidebarWarning {
	let conclusionText = "";

	if ( issues.some( issue => issue.result === BlockValidation.MissingBlock ) ) {
		conclusionText = sprintf(
			/* translators: %s expands to the schema block name. */
			__( "Not all required blocks are completed! No %s schema will be generated for your page.", "yoast-schema-blocks" ),
			sanitizeParentName( getHumanReadableBlockName( validation.name ) ),
		);

		return { text: conclusionText, color: "red" };
	}

	conclusionText = __( "Good job! All required blocks are completed.", "yoast-schema-blocks" );

	return { text: conclusionText, color: "green" };
}

/**
 * Gathers all validation issues recursively and flattens them into one list.
 *
 * @param validation The root validation result.
 *
 * @return all validation results.
 */
function getAllDescendantIssues( validation: BlockValidationResult ): BlockValidationResult[] {
	let results = [ validation ];
	validation.issues.forEach( issue => {
		results = results.concat( getAllDescendantIssues( issue ) );
	} );
	return results;
}

/**
 * Creates an array of warning messages from a block validation result.
 *
 * @param validation The block being validated.
 *
 * @returns {sidebarWarning[]} The formatted warnings.
 */
export function createAnalysisMessages( validation: BlockValidationResult ): sidebarWarning[] {
	let issues = getAllDescendantIssues( validation );

	// We are only interested in showing results that have a message ( missing blocks or results with a custom message).
	issues = issues.filter( issue => issue.message );

	const messages: sidebarWarning[] = issues.map( issue => ( {
		color: "red",
		text: issue.message,
	} ) );

	messages.push( getAnalysisConclusion( validation, issues ) );

	return messages;
}

/**
 * Strips "Yoast " of the name of the block and converts the string to lower case.
 *
 * @param parent The parent block name.
 *
 * @returns {string} The sanitized parent block name.
 */
export function sanitizeParentName( parent: string ): string {
	if ( parent.startsWith( "Yoast " ) ) {
		return parent.substr( 6 ).toLowerCase();
	}

	return parent.toLowerCase();
}

/**
 * Converts the validation results for a block instance with the given clientId to a presentable text.
 *
 * @param clientId The clientId to request validation results for.
 *
 * @returns {string} The presentable warning message, or null if no warnings are found.
 */
export default function getWarnings( clientId: string ): sidebarWarning[] {
	const validation: BlockValidationResult = getValidationResult( clientId );
	if ( ! validation ) {
		return null;
	}

	return createAnalysisMessages( validation );
}
