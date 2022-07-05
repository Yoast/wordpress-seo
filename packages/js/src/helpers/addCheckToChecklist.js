import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import getL10nObject from "../analysis/getL10nObject";

/**
 * Adds a "No focus keyword was entered" result when no focus keyphrase
 * was entered.
 *
 * @param {Object[]} checklist The checklist on which to add the check.
 * @param {Object}   store     The Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddFocusKeyphraseCheck( checklist, store ) {
	const focusKeyphrase = store.getFocusKeyphrase();

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
 * @param {Object[]} checklist The checklist on which to add the readability check.
 * @param {Object}   store     The Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddReadabilityCheck( checklist, store ) {
	const { isKeywordAnalysisActive } = store.getPreferences();

	if ( isKeywordAnalysisActive ) {
		const readabilityScoreIndicator = getIndicatorForScore( store.getReadabilityResults().overallScore );

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
 * @param {Object[]} checklist The checklist on which to add the SEO score.
 * @param {Object}   store     The Yoast SEO redux store.
 *
 * @returns {void}
 */
export function maybeAddSEOCheck( checklist, store ) {
	const { isContentAnalysisActive } = store.getPreferences();

	if ( isContentAnalysisActive ) {
		const seoScoreIndicator = getIndicatorForScore( store.getResultsForFocusKeyword().overallScore );
		const isPremium = getL10nObject().isPremium;

		checklist.push( {
			label: isPremium ? __( "Premium SEO analysis:", "wordpress-seo" ) : __( "SEO analysis:", "wordpress-seo" ),
			score: seoScoreIndicator.className,
			scoreValue: seoScoreIndicator.screenReaderReadabilityText,
		} );
	}
}

/**
 * Adds the inclusive language check if it is active.
 *
 * @param {Object[]} checklist The checklist on which to add the inclusive language score.
 * @param {Object}   store     The Yoast SEO store.
 *
 * @returns {void}
 */
export function maybeAddInclusiveLanguageCheck( checklist, store ) {
	const { isContentAnalysisActive } = store.getPreferences();

	if ( isContentAnalysisActive ) {
		const scoreIndicator = getIndicatorForScore( store.getInclusiveLanguageResults().overallScore );

		checklist.push( {
			label: __( "Inclusive language:", "wordpress-seo" ),
			score: scoreIndicator.className,
			scoreValue: scoreIndicator.screenReaderReadabilityText,
		} );
	}
}

/**
 * Checks if the array of blocks includes schema blocks.
 *
 * @param {object[]} blocks The array of blocks.
 *
 * @returns {boolean} If the list of blocks contains schema blocks.
 */
function includesSchemaBlocks( blocks ) {
	return blocks.some( block => block.attributes[ "is-yoast-schema-block" ] === true );
}

/**
 * Adds a score item for the schema blocks validation results, indicating whether all the
 * schema blocks on the page have valid schema.
 *
 * This check is hidden when no schema validation results are known
 * (e.g. when no schema blocks exist on the page).
 *
 * @param {Object[]} checklist          The score items to add the score to.
 * @param {Object}   yoastSchemaStore   The `yoast-seo/schema-blocks` Yoast SEO redux store.
 * @param {Object}   wpBlockEditorStore The `core/block-editor` WordPress store.
 *
 * @returns {void}
 */
export function maybeAddSchemaBlocksValidationCheck( checklist, yoastSchemaStore, wpBlockEditorStore ) {
	const blocks = wpBlockEditorStore.getBlocks();

	if ( ! includesSchemaBlocks( blocks ) ) {
		return;
	}
	const schemaBlocksValidationResults = yoastSchemaStore.getSchemaBlocksValidationResults();
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
