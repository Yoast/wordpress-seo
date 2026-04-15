import { useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { CONTENT_PLANNER_STORE } from "../constants";
import { removesLocaleVariantSuffixes } from "../../shared-admin/helpers";

/**
 * Returns a callback that fetches content planner suggestions.
 *
 * Reads the required parameters from the store and dispatches the
 * fetchContentPlannerSuggestions action when invoked.
 *
 * @returns {Function} Callback to trigger the content suggestions fetch.
 */
export const useFetchContentSuggestions = () => {
	const { endpoint, postType, contentLocale, editorApiValue } = useSelect( ( select ) => {
		return {
			endpoint: select( CONTENT_PLANNER_STORE ).selectContentSuggestionsEndpoint(),
			postType: select( "yoast-seo/editor" ).getPostType(),
			contentLocale: select( "yoast-seo/editor" ).getContentLocale(),
			editorApiValue: select( "yoast-seo/editor" ).getEditorTypeApiValue(),
		};
	}, [] );

	const { fetchContentPlannerSuggestions } = useDispatch( CONTENT_PLANNER_STORE );

	return useCallback( () => {
		const language = removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" );
		fetchContentPlannerSuggestions( { endpoint, postType, language, editor: editorApiValue } );
	}, [ endpoint, postType, contentLocale, editorApiValue, fetchContentPlannerSuggestions ] );
};
