import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import PrePublish from "../components/PrePublish";

/**
 * Adds a "No focus keyword was entered" result when no focus keyphrase
 * was entered.
 *
 * @param {Object[]} checklist         The checklist on which to add the check.
 * @param {boolean}  hasFocusKeyphrase Whether there is a focus keyphrase.
 *
 * @returns {void}
 */
function addFocusKeyphraseCheck( checklist, hasFocusKeyphrase ) {
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
function addReadabilityCheck( checklist, readabilityScore, isReadabilityAnalysisActive ) {
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
function addSEOCheck( checklist, seoScore, isSEOAnalysisActive ) {
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
function addSchemaBlocksValidationCheck( checklist, schemaBlocksValidationResults ) {
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

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const focusKeyphrase = data.getFocusKeyphrase();
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );
		const { isKeywordAnalysisActive, isContentAnalysisActive } = data.getPreferences();
		const schemaBlocksValidationResults = data.getSchemaBlocksValidationResults();

		const checklist = [];

		addFocusKeyphraseCheck( checklist, focusKeyphrase );
		addReadabilityCheck( checklist, readabilityScoreIndicator, isKeywordAnalysisActive );
		addSEOCheck( checklist, seoScoreIndicator, isContentAnalysisActive );
		addSchemaBlocksValidationCheck( checklist, schemaBlocksValidationResults );

		return { checklist, shouldShowIntro: true };
	} ),
	withDispatch( ( dispatch ) => {
		const { closePublishSidebar, openGeneralSidebar } = dispatch(
			"core/edit-post"
		);
		/**
		 * Closes the publish sidebar and opens the Yoast sidebar.
		 *
		 * @returns {void}
		 */
		const onClick = () => {
			closePublishSidebar();
			openGeneralSidebar( "yoast-seo/seo-sidebar" );
		};

		return { onClick };
	} ),
] )( PrePublish );
