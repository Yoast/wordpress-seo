import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";

import AnalysisChecklist from "../components/AnalysisChecklist";
import {
	maybeAddReadabilityCheck,
	maybeAddSEOCheck,
	maybeAddInclusiveLanguageCheck,
} from "../helpers/addCheckToChecklist";

/**
 * Maps the select function to props for the checklist.
 *
 * @param {function} select The WordPress select function.
 *
 * @returns {{checklist: []}} The props for the checklist.
 */
export function mapSelectToProps( select ) {
	const yoastStore = select( "yoast-seo/editor" );

	const checklist = [];

	maybeAddSEOCheck( checklist, yoastStore );
	maybeAddReadabilityCheck( checklist, yoastStore );
	maybeAddInclusiveLanguageCheck( checklist, yoastStore );

	checklist.push( ...Object.values( yoastStore.getChecklistItems() ) );

	return { checklist };
}

/**
 * Maps the dispatch function to props for the checklist.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {{onClick: onClick}} The properties to use.
 */
export function mapDispatchToProps( dispatch ) {
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
}

export default compose( [
	withSelect( mapSelectToProps ),
	withDispatch( mapDispatchToProps ),
] )( AnalysisChecklist );
