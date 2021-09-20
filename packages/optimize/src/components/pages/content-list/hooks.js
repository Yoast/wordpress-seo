import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { debounce } from "lodash";
import { OPTIMIZE_STORE_KEY, QUERY_DELAY } from "../../../constants";
import { createInitialQueryData } from "../../../redux/initial-state";

/**
 *
 * @param {Object} contentType Content type options.
 * @returns {Object} options, items and pagination data and handle query update callback for content type.
 */
export const useContentListQuery = ( contentType ) => {
	const query = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getQuery(), [ contentType.slug ] );
	const data = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getProcessedListData( contentType.slug ), [ contentType.slug ] );

	const { handleQuery, handleMoreResultsQuery, setQueryData, setAllQueryData, resetListData } = useDispatch( OPTIMIZE_STORE_KEY );

	const debouncedHandleQuery = useCallback( debounce( handleQuery, QUERY_DELAY ), [ handleQuery ] );
	const debouncedHandleMoreResultsQuery = useCallback( debounce( handleMoreResultsQuery, QUERY_DELAY ), [ handleMoreResultsQuery ] );

	// On mount, set the query data to current content type
	useEffect( () => {
		resetListData();
		setAllQueryData( createInitialQueryData( contentType ) );
	}, [] );
	// Whenever query data changes, trigger handle query data action
	useEffect( () => {
		debouncedHandleQuery();
	}, [ query.data ] );

	return {
		contentType,
		query,
		data,
		setQueryData,
		setAllQueryData,
		handleMoreResultsQuery: debouncedHandleMoreResultsQuery,
	};
};
