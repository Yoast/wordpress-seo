import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { compose } from "@wordpress/compose";
import PrimaryTaxonomyPicker from "../components/PrimaryTaxonomyPicker";

// Stable reference for the empty-terms case, to avoid creating a new array on every render.
const EMPTY_TERM_IDS = [];

/**
 * Maps the select function to props.
 *
 * Uses output memoization: returns the same object reference whenever the
 * computed content has not changed. This prevents `withSelect` from seeing
 * a new reference on every render, which would cause unnecessary re-renders.
 *
 * @returns {Function} A memoized withSelect callback.
 */
const makeWithSelectProps = () => {
	let lastResult = null;

	return ( select, props ) => {
		const { taxonomy } = props;
		const editorData = select( "core/editor" );
		const yoastData = select( "yoast-seo/editor" );

		const selectedTermIds = editorData.getEditedPostAttribute( taxonomy.restBase ) ?? EMPTY_TERM_IDS;
		const primaryTaxonomyId = yoastData.getPrimaryTaxonomyId( taxonomy.name );
		const learnMoreLink = yoastData.selectLink( "https://yoa.st/primary-category-more" );

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if ( JSON.stringify( { selectedTermIds, primaryTaxonomyId, learnMoreLink } ) === JSON.stringify( lastResult ) ) {
			return lastResult;
		}

		lastResult = { selectedTermIds, primaryTaxonomyId, learnMoreLink };
		return lastResult;
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
