import { useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { NEEDS_IMPROVEMENT_FIELD_PARAMS, PAGE_SIZE, STORE_NAME } from "../constants";

/**
 * Maps a single API row (snake_case) to a {@link BulkEditorItem} (camelCase).
 *
 * @param {Object} post The API row.
 *
 * @returns {import("../field-sets").BulkEditorItem} The bulk editor item.
 */
const formatPost = ( post ) => ( {
	id: post.id,
	title: post.title,
	status: post.status,
	editLink: post.edit_link,
	focusKeyphrase: post.focus_keyphrase,
	seoTitle: post.seo_title,
	metaDescription: post.meta_description,
	socialTitle: post.social_title,
	socialDescription: post.social_description,
	editable: post.editable,
	needsImprovement: post.needs_improvement ?? {},
} );

/**
 * Maps the paginated API response to the settled hook state.
 *
 * @param {Object} response The API response wrapper.
 *
 * @returns {Object} The settled hook state.
 */
const formatResponse = ( response ) => {
	const { posts = [], total = 0, total_pages: totalPages = 0 } = response ?? {};
	return { data: posts.map( formatPost ), total, totalPages, error: null, isPending: false };
};

/**
 * Fetches a page of posts for a content type and maps them to bulk editor rows.
 *
 * Kept self-contained within the bulk editor: it drives the request through the injected
 * RemoteDataProvider and manages its own loading/error state.
 *
 * @param {Object}             props                    The props.
 * @param {DataProvider}       props.dataProvider       The data provider (holds the endpoint).
 * @param {RemoteDataProvider} props.remoteDataProvider The remote data provider (performs the request).
 * @param {string}             props.contentType        The content type to fetch posts for.
 *
 * @returns {{data: Object[], error: ?Error, isPending: boolean, updateItem: Function}} The remote data info.
 */
export const usePosts = ( { dataProvider, remoteDataProvider, contentType } ) => {
	const [ state, setState ] = useState( { data: [], total: 0, totalPages: 0, error: null, isPending: true } );

	// Reflects a saved field locally; there is no refetch yet, so a successful save updates the row in place.
	const updateItem = useCallback( ( id, key, value ) => {
		setState( ( previous ) => ( {
			...previous,
			data: previous.data.map( ( item ) => ( item.id === id ? { ...item, [ key ]: value } : item ) ),
		} ) );
	}, [] );
	/** @type {import("react").MutableRefObject<AbortController>} */
	const controller = useRef();

	const search = useSelect( ( select ) => select( STORE_NAME ).selectSearch(), [] );
	const page = useSelect( ( select ) => select( STORE_NAME ).selectPage(), [] );
	const statuses = useSelect( ( select ) => select( STORE_NAME ).selectStatuses(), [] );
	const needsImprovement = useSelect( ( select ) => select( STORE_NAME ).selectNeedsImprovement(), [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );

	// Resolve the tab-agnostic "needs improvement" concepts to the active tab's concrete field params.
	const needsImprovementFields = useMemo( () => {
		const fieldParams = NEEDS_IMPROVEMENT_FIELD_PARAMS[ activeFieldSet ] ?? {};
		return needsImprovement.map( ( concept ) => fieldParams[ concept ] ).filter( Boolean );
	}, [ needsImprovement, activeFieldSet ] );

	const endpoint = dataProvider.getEndpoint( "posts" );

	useEffect( () => {
		// Without an endpoint there is nothing to fetch; surface an empty, settled state.
		if ( ! endpoint ) {
			setState( { data: [], total: 0, totalPages: 0, error: null, isPending: false } );
			return;
		}

		// Abort any in-flight request before starting a new one (e.g. on content type change).
		controller.current?.abort();
		// Keep this run's controller in the closure: abort is best-effort, so a superseded
		// request can still settle and must not overwrite the newer request's state.
		const current = new AbortController();
		controller.current = current;

		setState( ( previous ) => ( { ...previous, isPending: true } ) );

		remoteDataProvider
			.fetchJson(
				endpoint,
				{
					/* eslint-disable camelcase -- The REST endpoint expects snake_case query parameters. */
					content_type: contentType,
					per_page: String( PAGE_SIZE ),
					page: String( page ),
					search,
					status: statuses,
					needs_improvement: needsImprovementFields,
					/* eslint-enable camelcase */
				},
				{ signal: current.signal }
			)
			.then( ( response ) => {
				if ( controller.current === current ) {
					setState( formatResponse( response ) );
				}
			} )
			.catch( ( error ) => {
				// Ignore abort errors: they are expected when a newer request supersedes this one.
				if ( controller.current === current && error?.name !== "AbortError" ) {
					setState( { data: [], total: 0, totalPages: 0, error, isPending: false } );
				}
			} );

		return () => current.abort();
	}, [ endpoint, contentType, remoteDataProvider, search, page, statuses, needsImprovementFields ] );

	return { ...state, updateItem };
};
