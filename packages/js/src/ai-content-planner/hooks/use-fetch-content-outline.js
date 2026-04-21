import { useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";
import { removesLocaleVariantSuffixes } from "../../shared-admin/helpers";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Returns a callback that fetches a content outline for the selected suggestion.
 *
 * Reads the required parameters from the store and dispatches the
 * fetchContentOutline action when invoked.
 *
 * @returns {(contentSuggestion: Suggestion) => void} Callback to trigger the content outline fetch.
 */
export const useFetchContentOutline = () => {
	const { endpoint, postType, contentLocale, editorApiValue } = useSelect( ( select ) => {
		return {
			endpoint: select( CONTENT_PLANNER_STORE ).selectContentOutlineEndpoint(),
			postType: select( "yoast-seo/editor" ).getPostType(),
			contentLocale: select( "yoast-seo/editor" ).getContentLocale(),
			editorApiValue: select( "yoast-seo/editor" ).getEditorTypeApiValue(),
		};
	}, [] );

	const selectContentOutlineCache = useSelect( ( select ) => select( CONTENT_PLANNER_STORE ).selectContentOutlineCache );

	const { fetchContentOutline, restoreContentOutlineFromCache, setFeatureModalStatus } = useDispatch( CONTENT_PLANNER_STORE );

	return useCallback( ( contentSuggestion ) => {
		const cache = selectContentOutlineCache( contentSuggestion.index );
		if ( cache ) {
			restoreContentOutlineFromCache( cache );
			setFeatureModalStatus( FEATURE_MODAL_STATUS.contentOutline );
			return;
		}

		const language = removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" );
		fetchContentOutline( {
			endpoint,
			postType,
			language,
			editor: editorApiValue,
			suggestion: {
				...contentSuggestion,
			},
		} );
	}, [ endpoint, postType, contentLocale, editorApiValue, fetchContentOutline, restoreContentOutlineFromCache, selectContentOutlineCache ] );
};
