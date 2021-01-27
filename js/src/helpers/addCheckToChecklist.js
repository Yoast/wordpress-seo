import { __ } from "@wordpress/i18n";

/**
 * Adds a "No focus keyword was entered" result when no focus keyphrase
 * was entered.
 *
 * @param {Object[]} checklist         The checklist on which to add the check.
 * @param {boolean}  hasFocusKeyphrase Whether there is a focus keyphrase.
 *
 * @returns {void}
 */
export function addFocusKeyphraseCheck( checklist, hasFocusKeyphrase ) {
	if ( ! hasFocusKeyphrase ) {
		checklist.push( {
			label: __( "No focus keyword was entered", "wordpress-seo" ),
			score: "bad",
		} );
	}
}

/**
 * Adds the readability check if readability analysis is active.
 *
 * @param {Object[]} checklist                   The checklist on which to add the readability check.
 * @param {Object}   readabilityScore            The readability score.
 * @param {boolean}  isReadabilityAnalysisActive Whether readability analysis is active or not.
 *
 * @returns {void}
 */
export function addReadabilityCheck( checklist, readabilityScore, isReadabilityAnalysisActive ) {
	if ( isReadabilityAnalysisActive ) {
		checklist.push( {
			label: __( "Readability analysis:", "wordpress-seo" ),
			score: readabilityScore.className,
			scoreValue: readabilityScore.screenReaderReadabilityText,
		} );
	}
}

/**
 * Adds the SEO check if SEO analysis is active.
 *
 * @param {Object[]} checklist           The checklist on which to add the SEO score.
 * @param {Object}   seoScore            The score on the SEO analysis.
 * @param {boolean}  isSEOAnalysisActive Whether SEO analysis is active or not.
 *
 * @returns {void}
 */
export function addSEOCheck( checklist, seoScore, isSEOAnalysisActive ) {
	if ( isSEOAnalysisActive ) {
		checklist.push( {
			label: __( "SEO analysis:", "wordpress-seo" ),
			score: seoScore.className,
			scoreValue: seoScore.screenReaderReadabilityText,
		} );
	}
}

/**
 * Adds a score item for the schema blocks validation results, indicating whether all the
 * schema blocks on the page have valid schema.
 *
 * This check is hidden when no schema validation results are known
 * (e.g. when no schema blocks exist on the page).
 *
 * @param {Object[]}   checklist                    The score items to add the score to.
 * @param {Object[]} schemaBlocksValidationResults The validation results.
 *
 * @returns {void}
 */
export function addSchemaBlocksValidationCheck( checklist, schemaBlocksValidationResults ) {
	const validationResults = Object.values( schemaBlocksValidationResults );

	if ( validationResults ) {
		const valid = validationResults.every( block => block.result <= 0 );

		checklist.push( {
			label: __( "Schema analysis:", "wordpress-seo" ),
			score: valid ? "good" : "bad",
			scoreValue: valid ? __( "Good", "wordpress-seo" ) : __( "Needs improvement", "wordpress-seo" ),
		} );
	}
}
