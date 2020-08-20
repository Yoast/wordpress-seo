import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import PrePublish from "../components/PrePublish";
import getIndicatorForScore from "../analysis/getIndicatorForScore";

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const focusKeyphrase = data.getFocusKeyphrase();
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );
		const { isKeywordAnalysisActive, isContentAnalysisActive } = data.getPreferences();

		return {
			focusKeyphrase,
			isKeywordAnalysisActive,
			isContentAnalysisActive,
			seoScore: seoScoreIndicator.className,
			seoScoreLabel: seoScoreIndicator.screenReaderReadabilityText,
			readabilityScore: readabilityScoreIndicator.className,
			readabilityScoreLabel: readabilityScoreIndicator.screenReaderReadabilityText,
		};
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
