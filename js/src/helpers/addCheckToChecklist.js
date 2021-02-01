import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";

/**
 * Adds a "No focus keyword was entered" result when no focus keyphrase
 * was entered.
 *
 * @param {Object[]} checklist  The checklist on which to add the check.
 * @param {Object}   storeState The current state of the Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddFocusKeyphraseCheck( checklist, storeState ) {
	const focusKeyphrase = storeState.getFocusKeyphrase();

	if ( ! focusKeyphrase ) {
		checklist.push( {
			label: __( "No focus keyword was entered", "wordpress-seo" ),
			score: "bad",
		} );
	}
}

/**
 * Adds the readability check if readability analysis is active.
 *
 * @param {Object[]} checklist  The checklist on which to add the readability check.
 * @param {Object}   storeState The current state of the Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddReadabilityCheck( checklist, storeState ) {
	const { isKeywordAnalysisActive } = storeState.getPreferences();

	if ( isKeywordAnalysisActive ) {
		const readabilityScoreIndicator = getIndicatorForScore( storeState.getReadabilityResults().overallScore );

		checklist.push( {
			label: __( "Readability analysis:", "wordpress-seo" ),
			score: readabilityScoreIndicator.className,
			scoreValue: readabilityScoreIndicator.screenReaderReadabilityText,
		} );
	}
}

/**
 * Adds the SEO check if SEO analysis is active.
 *
 * @param {Object[]} checklist  The checklist on which to add the SEO score.
 * @param {Object}   storeState The current state of the Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddSEOCheck( checklist, storeState ) {
	const { isContentAnalysisActive } = storeState.getPreferences();

	if ( isContentAnalysisActive ) {
		const seoScoreIndicator = getIndicatorForScore( storeState.getResultsForFocusKeyword().overallScore );

		checklist.push( {
			label: __( "SEO analysis:", "wordpress-seo" ),
			score: seoScoreIndicator.className,
			scoreValue: seoScoreIndicator.screenReaderReadabilityText,
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
 * @param {Object[]} checklist  The score items to add the score to.
 * @param {Object}   storeState The current state of the Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddSchemaBlocksValidationCheck( checklist, storeState ) {
	const schemaBlocksValidationResults = storeState.getSchemaBlocksValidationResults();
	const validationResults = Object.values( schemaBlocksValidationResults );

	if ( validationResults && validationResults.length > 0 ) {
		const valid = validationResults.every( block => block.result <= 0 );

		checklist.push( {
			label: __( "Schema analysis:", "wordpress-seo" ),
			score: valid ? "good" : "bad",
			scoreValue: valid ? __( "Good", "wordpress-seo" ) : __( "Needs improvement", "wordpress-seo" ),
		} );
	}
}
