import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";

import PrePublish from "../components/PrePublish";
import {
	maybeAddReadabilityCheck,
	maybeAddFocusKeyphraseCheck,
	maybeAddSEOCheck,
	maybeAddInclusiveLanguageCheck,
} from "../helpers/addCheckToChecklist";
import { getIsSeoDataDefault } from "../helpers/getIsSeoDataDefault";

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
	let lastResult = null;

	return ( select ) => {
		const yoastStore = select( "yoast-seo/editor" );

		const checklist = [];
		maybeAddFocusKeyphraseCheck( checklist, yoastStore );
		maybeAddSEOCheck( checklist, yoastStore );
		maybeAddReadabilityCheck( checklist, yoastStore );
		maybeAddInclusiveLanguageCheck( checklist, yoastStore );
		checklist.push( ...Object.values( yoastStore.getChecklistItems() ) );

		const isSeoDataDefault = getIsSeoDataDefault( yoastStore );

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if (
			lastResult !== null &&
			checklist.length === lastResult.checklist.length &&
			checklist.every( ( item, i ) =>
				item.label === lastResult.checklist[ i ].label &&
			item.score === lastResult.checklist[ i ].score &&
			item.scoreValue === lastResult.checklist[ i ].scoreValue
			) &&
			isSeoDataDefault.isAllTitlesDefault === lastResult.isSeoDataDefault.isAllTitlesDefault &&
			isSeoDataDefault.isAllDescriptionsDefault === lastResult.isSeoDataDefault.isAllDescriptionsDefault
		) {
			return lastResult;
		}

		lastResult = { checklist, isSeoDataDefault };
		return lastResult;
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
] )( PrePublish );
