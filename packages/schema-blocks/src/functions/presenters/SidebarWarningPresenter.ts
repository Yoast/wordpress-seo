import { getBlockType } from "../../functions/BlockHelper";
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import { BlockValidationResult } from "../../core/validation";
import { BlockValidation } from "../../core/validation/BlockValidation";

const warningTemplates: Record<number, string> = {
	[ BlockValidation.MissingBlock ]: "The '{parent} {child}' block is {status} but missing.",
	[ BlockValidation.MissingAttribute ]: "The '{parent} {child}' block is empty.",
};

type clientIdValidation = Record<string, BlockValidationResult>;

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
	const warning = get( warningTemplates, issue.result, "" );
	return warning.replace( "{parent}", issue.parent )
		.replace( "{child}", issue.name )
		.replace( "{status}", issue.status );
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

	// Only provide warning messages if the validation issues require warnings.
	if ( ! validation || validation.issues.every( issue => ! ( issue.result in warningTemplates ) ) ) {
		return null;
	}

	return createWarningMessages( validation );
}

/**
 * Creates an array of warning messages from a block validation result.
 *
 * @param validation The block being validated.
 * @returns {string[]} The formatted warnings.
 */
export function createWarningMessages( validation: BlockValidationResult ) {
	const parent = sanitizeBlockName( validation.name );
	const issues = validation.issues.map( ( issue ) => ( {
		name: sanitizeBlockName( issue.name ),
		parent: parent,
		result: issue.result,
		status: "required",
	} ) );

	const warnings = issues.map( issue => replaceVariables( issue ) );

	if ( issues.some( issue => issue.result === BlockValidation.MissingBlock || issue.result === BlockValidation.MissingAttribute ) ) {
		warnings.push( __( "Not all required blocks are completed! No recipe schema will be generated for your page.", "wpseo-schema-blocks" ) );
	}

	return warnings;
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
