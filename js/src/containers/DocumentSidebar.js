import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import DocumentSidebar from "../components/DocumentSidebar";

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const focusKeyphrase = data.getFocusKeyphrase();
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );

		return {
			focusKeyphrase,
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
		const onClick = () => {
			closePublishSidebar();
			openGeneralSidebar( "yoast-seo/seo-sidebar" );
		};

		return { onClick };
	} ),
] )( DocumentSidebar );
