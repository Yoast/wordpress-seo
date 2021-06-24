import { __, sprintf } from "@wordpress/i18n";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../../core/validation";

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
 * Calculates an analysis conclusion.
 *
 * @param issues The validation results on which to base the conclusion.
 *
 * @returns Any analysis conclusions that should be in the footer.
 */
function getAnalysisConclusion( issues: BlockValidationResult[] ): SidebarWarning {
	let conclusionText = "";

	// Show a red bullet when the block is invalid.
	if ( issues.some( issue => issue.result >= BlockValidation.Invalid ) ) {
		conclusionText = sprintf(
			/* translators: %s expands to the schema block name. */
			__( "Not all required information has been provided! %s schema will not be generated for your page.", "yoast-schema-blocks" ),
			"JobPosting",
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
 * Creates an array of warning messages from a list block validation results.
 *
 * @param issues The block validation results.
 *
 * @returns {SidebarWarning[]} The formatted warnings.
 */
export function createAnalysisMessages( issues: BlockValidationResult[] ): SidebarWarning[] {
	if ( ! issues ) {
		return [];
	}

	return [
		...getErrorMessages( issues ),
		...getWarningMessages( issues ),
		getAnalysisConclusion( issues ),
	];
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
