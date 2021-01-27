import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import AnalysisChecklist from "../components/AnalysisChecklist";

import {
	addReadabilityCheck,
	addSEOCheck,
	addSchemaBlocksValidationCheck,
} from "../helpers/addCheckToChecklist";

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );
		const { isKeywordAnalysisActive, isContentAnalysisActive } = data.getPreferences();
		const schemaBlocksValidationResults = data.getSchemaBlocksValidationResults();

		const checklist = [];

		addReadabilityCheck( checklist, readabilityScoreIndicator, isKeywordAnalysisActive );
		addSEOCheck( checklist, seoScoreIndicator, isContentAnalysisActive );
		addSchemaBlocksValidationCheck( checklist, schemaBlocksValidationResults );

		return { checklist, shouldShowIntro: false };
	} ),
	withDispatch( ( dispatch ) => {
		const { openGeneralSidebar } = dispatch(
			"core/edit-post"
		);
		/**
		 * Closes the publish sidebar and opens the Yoast sidebar.
		 *
		 * @returns {void}
		 */
		const onClick = () => {
			openGeneralSidebar( "yoast-seo/seo-sidebar" );
		};

		return { onClick };
	} ),
] )( AnalysisChecklist );
