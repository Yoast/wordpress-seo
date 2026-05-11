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
 * Uses output memoization: returns the same array reference whenever the
 * computed checklist content has not changed. This prevents `withSelect`
 * from seeing a new reference on every render, which would cause unnecessary
 * re-renders.
 *
 * @returns {Function} A memoized mapSelectToProps function.
 */
const makeMapSelectToProps = () => {
	let lastChecklist = [];

	return ( select ) => {
		const yoastStore = select( "yoast-seo/editor" );

		const checklist = [];
		maybeAddSEOCheck( checklist, yoastStore );
		maybeAddReadabilityCheck( checklist, yoastStore );
		maybeAddInclusiveLanguageCheck( checklist, yoastStore );
		checklist.push( ...Object.values( yoastStore.getChecklistItems() ) );

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if ( JSON.stringify( checklist ) === JSON.stringify( lastChecklist ) ) {
			return { checklist: lastChecklist };
		}

		lastChecklist = checklist;
		return { checklist };
	};
};

export const mapSelectToProps = makeMapSelectToProps();

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
