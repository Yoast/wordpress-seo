import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import AnalysisChecklist from "../components/AnalysisChecklist";

import {
	addReadabilityCheck,
	addFocusKeyphraseCheck,
	addSchemaBlocksValidationCheck,
	addSEOCheck,
} from "../helpers/addCheckToChecklist";

/**
 * Maps the select function to props for the checklist.
 *
 * @param {function} select The WordPress select function.
 *
 * @returns {{shouldShowIntro: boolean, checklist: []}} The props for the checklist.
 */
export function mapSelectToProps( select ) {
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
}

/**
 * Maps the dispatch function to props for the checklist.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {{onClick: onClick}} The properties to use.
 */
export function mapDispatchToProps( dispatch ) {
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
}

export default compose( [
	withSelect( mapSelectToProps ),
	withDispatch( mapDispatchToProps ),
] )( AnalysisChecklist );
