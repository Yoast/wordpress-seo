import { __, sprintf } from "@wordpress/i18n";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../../core/validation";
import { getHumanReadableBlockName } from "../BlockHelper";
import { getAllDescendantIssues } from "../validators";

/**
 * A warning message for in the sidebar schema analysis.
 */
export type SidebarWarning = {
	/**
	 * The warning message.
	 */
	text: string;

	/**
	 * Color of the warning.
	 */
	color: "red" | "orange" | "green";
}

/**
 * Adds analysis conclusions to the footer.
 *
 * @param validation The validation result for the current block.
 *
 * @returns Any analysis conclusions that should be in the footer.
 */
function getAnalysisConclusion( validation: BlockValidationResult ): SidebarWarning {
	let conclusionText = "";

	// Show a red bullet when the block is invalid.
	if ( validation.result >= BlockValidation.Invalid ) {
		conclusionText = sprintf(
			/* translators: %s expands to the schema block name. */
			__( "Not all required information has been provided! No %s schema will be generated for your page.", "yoast-schema-blocks" ),
			sanitizeParentName( getHumanReadableBlockName( validation.name ) ),
		);

		return { text: conclusionText, color: "red" };
	}

	conclusionText = __( "Good job! All required information has been provided.", "yoast-schema-blocks" );

	return { text: conclusionText, color: "green" };
}

/**
 * Get a list of (red) error messages.
 *
 * @param issues The block validation issues.
 *
 * @return The error messages.
 */
function getErrorMessages( issues: BlockValidationResult[] ): SidebarWarning[] {
	const requiredBlockIssues = issues.filter( issue => issue.message && issue.blockPresence === BlockPresence.Required );

	return requiredBlockIssues.map( issue => ( {
		color: "red",
		text: issue.message,
	} ) );
}

/**
 * Get a list of (orange) warning messages.
 *
 * @param issues The block validation issues.
 *
 * @return The warning messages.
 */
function getWarningMessages( issues: BlockValidationResult[] ): SidebarWarning[] {
	const recommendedBlockIssues = issues.filter( issue => issue.message && issue.blockPresence === BlockPresence.Recommended );

	return recommendedBlockIssues.map( issue => ( {
		color: "orange",
		text: issue.message,
	} ) );
}

/**
 * Creates an array of warning messages from a block validation result.
 *
 * @param validation The block being validated.
 *
 * @returns {SidebarWarning[]} The formatted warnings.
 */
export function createAnalysisMessages( validation: BlockValidationResult ): SidebarWarning[] {
	if ( ! validation ) {
		return [];
	}

	const issues = getAllDescendantIssues( validation );
	const messages = [];

	messages.push( ...getErrorMessages( issues ) );
	messages.push( ...getWarningMessages( issues ) );

	messages.push( getAnalysisConclusion( validation ) );

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
