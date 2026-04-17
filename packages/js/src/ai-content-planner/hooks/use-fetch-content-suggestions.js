import { useCallback, useEffect, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { CONTENT_PLANNER_STORE } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { removesLocaleVariantSuffixes } from "../../shared-admin/helpers";

/**
 * Returns a callback that fetches content planner suggestions.
 *
 * Reads the required parameters from the store and dispatches the
 * fetchContentPlannerSuggestions action when invoked.
 * Also handles usage count fetching and incrementing on success.
 *
 * @returns {Function} Callback to trigger the content suggestions fetch.
 */
export const useFetchContentSuggestions = () => {
	const { endpoint, postType, contentLocale, editorApiValue, usageCountEndpoint, suggestionsStatus } = useSelect( ( select ) => {
		return {
			endpoint: select( CONTENT_PLANNER_STORE ).selectContentSuggestionsEndpoint(),
			postType: select( "yoast-seo/editor" ).getPostType(),
			contentLocale: select( "yoast-seo/editor" ).getContentLocale(),
			editorApiValue: select( "yoast-seo/editor" ).getEditorTypeApiValue(),
			usageCountEndpoint: select( STORE_NAME_AI ).selectUsageCountEndpoint(),
			suggestionsStatus: select( CONTENT_PLANNER_STORE ).selectSuggestionsStatus(),
		};
	}, [] );

	const { fetchContentPlannerSuggestions } = useDispatch( CONTENT_PLANNER_STORE );
	const { fetchUsageCount, addUsageCount } = useDispatch( STORE_NAME_AI );

	const prevSuggestionsStatus = useRef( suggestionsStatus );

	useEffect( () => {
		if ( prevSuggestionsStatus.current !== ASYNC_ACTION_STATUS.success &&
			suggestionsStatus === ASYNC_ACTION_STATUS.success ) {
			addUsageCount();
		}
		prevSuggestionsStatus.current = suggestionsStatus;
	}, [ suggestionsStatus, addUsageCount ] );

	return useCallback( () => {
		const language = removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" );
		fetchContentPlannerSuggestions( { endpoint, postType, language, editor: editorApiValue } );
		if ( usageCountEndpoint ) {
			fetchUsageCount( { endpoint: usageCountEndpoint, isWooProductEntity: false } );
		}
	}, [ endpoint, postType, contentLocale, editorApiValue, fetchContentPlannerSuggestions, usageCountEndpoint, fetchUsageCount ] );
};
