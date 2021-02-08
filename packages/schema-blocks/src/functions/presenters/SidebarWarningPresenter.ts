import { getBlockType } from "../../functions/BlockHelper";
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import { BlockValidationResult } from "../../core/validation";
import { BlockValidation } from "../../core/validation/BlockValidation";

const analysisMessageTemplates: Record<number, string> = {
	[ BlockValidation.MissingBlock ]: "The '{parent} {child}' block is {status} but missing.",
	[ BlockValidation.MissingAttribute ]: "The '{parent} {child}' block is empty.",
};

type clientIdValidation = Record<string, BlockValidationResult>;

type analysisIssue = {
	name: string;
	parent: string;
	result: BlockValidation;
	status: string;
};

/**
 * Gets the validation results from the store for a blockinstance with the given clientId.
 *
 * @param clientId The clientId to request validation results for.
 * @returns {BlockValidationResult} The validation results, or null if none were found.
 */
function getValidationResult( clientId: string ): BlockValidationResult | null {
	const store: { validations: clientIdValidation } = select( "yoast-seo/editor" ).getSchemaBlocksValidationResults();
	if ( ! store || ! store.validations ) {
		return null;
	}

	return store.validations[ clientId ];
}

export type WarningDefinition = {
	name: string;
	parent: string;
	result: BlockValidation;
	status: string;
};

/**
 * Transforms a template into a warning message given validation details.
 *
 * @param issue Details about the current issue.
 *
 *  @returns {string} The presentable warning message appropriate for this issue.
 */
export function replaceVariables( issue: WarningDefinition ): string {
	const warning = get( analysisMessageTemplates, issue.result, "" );
	return warning.replace( "{parent}", __( issue.parent, "wpseo-schema-blocks" ) )
		.replace( "{child}", __( issue.name, "wpseo-schema-blocks" ) )
		.replace( "{status}", __( issue.status, "wpseo-schema-blocks" ) );
}

/**
 * Converts the validation results for a blockinstance with the given clientId to a presentable text.
 *
 * @param clientId   The clientId to request validation results for.
 *
 * @returns {string} The presentable warning message, or null if no warnings are found.
 */
export default function getWarnings( clientId: string ): string[] {
	const validation: BlockValidationResult = getValidationResult( clientId );
	if ( ! validation ) {
		return null;
	}

	return createAnalysisMessages( validation );
}

/**
 * Creates an array of warning messages from a block validation result.
 *
 * @param validation The block being validated.
 * @returns {string[]} The formatted warnings.
 */
export function createAnalysisMessages( validation: BlockValidationResult ) {
	const parent = sanitizeBlockName( validation.name );

	// Create a message if all is good or some are bad.
	const issues: analysisIssue[] = validation.issues
		.filter( ( issue: BlockValidationResult ) => issue.result in analysisMessageTemplates )
		.map( ( issue: BlockValidationResult ) => ( {
			name: sanitizeBlockName( issue.name ),
			parent: parent,
			result: issue.result,
			status: "required",
		} ) );

	const messages = issues.map( issue => replaceVariables( issue ) );
	const conclusion = getAnalysisConclusion( validation.result, issues );
	if ( conclusion && conclusion.length > 0 ) {
		messages.push( conclusion );
	}

	return messages;
}

/**
 * Adds analysis conclusions to the footer.
 *
 * @param validation The validation result for the current block.
 * @param issues     The detected issues with metadata.
 * @returns {string} Any analysis conclusions that should be in the footer.
 */
function getAnalysisConclusion( validation: BlockValidation, issues: analysisIssue[] ): string {
	if ( issues.some( issue => issue.result === BlockValidation.MissingBlock || issue.result === BlockValidation.MissingAttribute ) ) {
		return __( "Not all required blocks are completed! No '" + issues[ 0 ].parent +
			"' schema will be generated for your page.", "wpseo-schema-blocks" );
	}

	if ( validation === BlockValidation.Valid ) {
		return __( "Good job! All required blocks are completed.", "wpseo-schema-blocks" );
	}
}

/**
 * Makes a block name human readable.
 *
 * @param blockName The block name to sanitize.
 *
 * @returns {string} The sanitized block name.
 */
export function sanitizeBlockName( blockName: string ): string {
	const blockType = getBlockType( blockName ) || "";
	if ( blockType ) {
		return blockType.title;
	}

	const lastSlash = blockName.lastIndexOf( "/" );
	if ( lastSlash < 0 || lastSlash === blockName.length - 1 ) {
		return blockName;
	}

	return blockName.substring( lastSlash + 1 );
}
