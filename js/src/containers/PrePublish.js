import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import PrePublish from "../components/PrePublish";

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const focusKeyphrase = data.getFocusKeyphrase();
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );
		const { isKeywordAnalysisActive, isContentAnalysisActive } = data.getPreferences();
		const schemaBlocksValidationResults = data.getSchemaBlocksValidationResults();

		const scoreItems = [];

		if ( ! focusKeyphrase ) {
			scoreItems.push( {
				label: __( "No focus keyword was entered", "wordpress-seo" ),
				score: "bad",
				scoreValue: "",
			} );
		}

		if ( isKeywordAnalysisActive ) {
			scoreItems.push( {
				label: __( "Readability analysis:", "wordpress-seo" ),
				score: readabilityScoreIndicator.className,
				scoreValue: readabilityScoreIndicator.screenReaderReadabilityText,
			} );
		}

		if ( isContentAnalysisActive ) {
			scoreItems.push( {
				label: __( "SEO analysis:", "wordpress-seo" ),
				score: seoScoreIndicator.className,
				scoreValue: seoScoreIndicator.screenReaderReadabilityText,
			} );
		}

		if ( schemaBlocksValidationResults !== {} ) {
			const valid = Object.values( schemaBlocksValidationResults ).every( block => block.result <= 0 );

			scoreItems.push( {
				label: __( "Schema analysis:", "wordpress-seo" ),
				score: valid ? "good" : "bad",
				scoreValue: valid ? __( "Good", "wordpress-seo" ) : __( "Needs improvement", "wordpress-seo" ),
			} );
		}

		return { scoreItems };
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
