import { useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";
import { removesLocaleVariantSuffixes } from "../../shared-admin/helpers";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

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
	const { endpoint, postType, contentLocale, editorApiValue, isUsageCountLimitReached, usageCountEndpoint } = useSelect( ( select ) => {
		return {
			endpoint: select( CONTENT_PLANNER_STORE ).selectContentSuggestionsEndpoint(),
			postType: select( "yoast-seo/editor" ).getPostType(),
			contentLocale: select( "yoast-seo/editor" ).getContentLocale(),
			editorApiValue: select( "yoast-seo/editor" ).getEditorTypeApiValue(),
			usageCountEndpoint: select( STORE_NAME_AI ).selectUsageCountEndpoint(),
			isUsageCountLimitReached: select( STORE_NAME_AI ).isUsageCountLimitReached(),
		};
	}, [] );

	const { fetchContentPlannerSuggestions, setFeatureModalStatus, setContentSuggestionsStatus } = useDispatch( CONTENT_PLANNER_STORE );
	const { fetchUsageCount, addUsageCount } = useDispatch( STORE_NAME_AI );

	// eslint-disable-next-line complexity
	return useCallback( async() => {
		// Before fetching usage count, check if it's already known that the limit has been reached to avoid unnecessary API calls.
		if ( isUsageCountLimitReached ) {
			setFeatureModalStatus( FEATURE_MODAL_STATUS.idle );
			return;
		}
		setFeatureModalStatus( FEATURE_MODAL_STATUS.contentSuggestions );
		setContentSuggestionsStatus( ASYNC_ACTION_STATUS.loading );
		// Getting the usage count.
		const { payload } = await fetchUsageCount( { endpoint: usageCountEndpoint, isWooProductEntity: false } );
		const sparksLimitReached = ( payload?.errorCode === 429 && payload?.errorIdentifier === "USAGE_LIMIT_REACHED" ) || payload.count >= payload.limit;

		if ( sparksLimitReached ) {
			setFeatureModalStatus( FEATURE_MODAL_STATUS.idle );
			setContentSuggestionsStatus( ASYNC_ACTION_STATUS.idle );
			return;
		}
		const language = removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" );
		fetchContentPlannerSuggestions( { endpoint, postType, language, editor: editorApiValue } );
		addUsageCount();
	}, [ endpoint,
		postType,
		contentLocale,
		editorApiValue,
		isUsageCountLimitReached,
		usageCountEndpoint,
		fetchContentPlannerSuggestions,
		addUsageCount,
		fetchUsageCount,
		setFeatureModalStatus ] );
};
