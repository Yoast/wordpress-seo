import { getBlockType } from "../BlockHelper";
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import { BlockValidationResult } from "../../core/validation";
import { BlockValidation } from "../../core/validation";

const analysisMessageTemplates: Record<number, string> = {
	[ BlockValidation.MissingBlock ]: "The '{child}' block is {status} but missing.",
	[ BlockValidation.MissingAttribute ]: "The '{child}' block is empty.",
};

type clientIdValidation = Record<string, BlockValidationResult>;

type analysisIssue = {
	name: string;
	parent: string;
	result: BlockValidation;
	status: string;
};

export type sidebarWarning = {
	text: string;
	color: string;
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
 * Transforms a template into a warning message given validation details.
 *
 * @param issue Details about the current issue.
 *
 * @returns {string} The presentable warning message appropriate for this issue.
 */
export function replaceVariables( issue: analysisIssue ): string {
	const warning = get( analysisMessageTemplates, issue.result, "" );
	return warning.replace( "{parent}", __( issue.parent, "wpseo-schema-blocks" ) )
		.replace( "{child}", __( issue.name, "wpseo-schema-blocks" ) )
		.replace( "{status}", __( issue.status, "wpseo-schema-blocks" ) );
}

/**
 * Adds analysis conclusions to the footer.
 *
 * @param validation The validation result for the current block.
 * @param issues     The detected issues with metadata.
 *
 * @returns {sidebarWarning} Any analysis conclusions that should be in the footer.
 */
function getAnalysisConclusion( validation: BlockValidation, issues: analysisIssue[] ): sidebarWarning {
	if ( issues.some( issue => issue.result === BlockValidation.MissingBlock ||
		issue.result === BlockValidation.MissingAttribute ) ) {
		return {
			text: __( "Not all required blocks are completed! No " + issues[ 0 ].parent +
				" schema will be generated for your page.", "wpseo-schema-blocks" ),
			color: "red",
		} as sidebarWarning;
	}

	if ( validation === BlockValidation.Valid ||
		issues.every( issue => issue.result !== BlockValidation.MissingAttribute &&
			issue.result !== BlockValidation.MissingBlock ) ) {
		return {
			text: __( "Good job! All required blocks are completed.", "wpseo-schema-blocks" ),
			color: "green",
		} as sidebarWarning;
	}
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
	const parent = sanitizeBlockName( validation.name );

	// Create a message if there are any validation issues we have a template for.
	const messageData: analysisIssue[] = getAllDescendantIssues( validation )
		.filter( ( issue: BlockValidationResult ) => issue.result in analysisMessageTemplates )
		.map( ( issue: BlockValidationResult ) => ( {
			name: sanitizeBlockName( issue.name ),
			parent: sanitizeParentName( parent ),
			result: issue.result,
			status: "required",
		} ) );
	const messages = messageData.map( msg => {
		return { text: replaceVariables( msg ), color: "red" } as sidebarWarning;
	} );

	const conclusion = getAnalysisConclusion( validation.result, messageData );

	if ( conclusion ) {
		messages.push( conclusion );
	}

	return messages;
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
