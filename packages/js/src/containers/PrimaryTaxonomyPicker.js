import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { compose } from "@wordpress/compose";
import PrimaryTaxonomyPicker from "../components/PrimaryTaxonomyPicker";

// Stable reference for the empty-terms case, to avoid creating a new array on every render.
const EMPTY_TERM_IDS = [];

/**
 * Checks whether the newly computed withSelect props are identical to the last memoized result.
 *
 * @param {Object|null} lastResult         The previously memoized result, or null on first call.
 * @param {Array}       selectedTermIds    The newly computed selected term IDs.
 * @param {number|null} primaryTaxonomyId  The newly computed primary taxonomy ID.
 * @param {string}      learnMoreLink      The newly computed learn-more link.
 *
 * @returns {boolean} True when all props are unchanged and the cached result can be reused.
 */
function withSelectPropsAreEqual( lastResult, selectedTermIds, primaryTaxonomyId, learnMoreLink ) {
	return lastResult !== null &&
		// Object.is is used instead of === to handle NaN correctly: the component constructor
		// dispatches setPrimaryTaxonomyId with parseInt("", 10) = NaN before the field is set,
		// and NaN === NaN is false in JS, which would cause the memoization to miss the cache.
		Object.is( primaryTaxonomyId, lastResult.primaryTaxonomyId ) &&
		learnMoreLink === lastResult.learnMoreLink &&
		selectedTermIds.length === lastResult.selectedTermIds.length &&
		selectedTermIds.every( ( id, i ) => id === lastResult.selectedTermIds[ i ] );
}

/**
 * Maps the select function to props.
 *
 * Uses output memoization: returns the same object reference whenever the
 * computed content has not changed. This prevents `withSelect` from seeing
 * a new reference on every render, which would cause unnecessary re-renders.
 *
 * @returns {Function} A memoized withSelect callback.
 */
export const makeWithSelectProps = () => {
	// Keyed by taxonomy name so that multiple mounted instances do not share a single lastResult.
	const lastResults = new Map();

	return ( select, props ) => {
		const { taxonomy } = props;
		const editorData = select( "core/editor" );
		const yoastData = select( "yoast-seo/editor" );

		const selectedTermIds = editorData.getEditedPostAttribute( taxonomy.restBase ) ?? EMPTY_TERM_IDS;
		const primaryTaxonomyId = yoastData.getPrimaryTaxonomyId( taxonomy.name );
		const learnMoreLink = yoastData.selectLink( "https://yoa.st/primary-category-more" );

		const lastResult = lastResults.get( taxonomy.name ) ?? null;

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if ( withSelectPropsAreEqual( lastResult, selectedTermIds, primaryTaxonomyId, learnMoreLink ) ) {
			return lastResult;
		}

		const result = { selectedTermIds, primaryTaxonomyId, learnMoreLink };
		lastResults.set( taxonomy.name, result );
		return result;
	};
};

export default compose( [
	withSelect( makeWithSelectProps() ),
	withDispatch( dispatch => {
		const {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		} = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		};
	} ),
] )( PrimaryTaxonomyPicker );
