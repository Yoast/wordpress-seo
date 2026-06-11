import { useEffect, useRef, useState } from "@wordpress/element";
import { PAGE_SIZE } from "../constants";

/**
 * Maps a single API row (snake_case) to a {@link BulkEditorRow} (camelCase).
 *
 * @param {Object} post The API row.
 *
 * @returns {import("../field-sets").BulkEditorRow} The bulk editor row.
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
} );

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
 * @returns {{data: import("../field-sets").BulkEditorRow[], error?: Error, isPending: boolean}} The remote data info.
 */
export const usePosts = ( { dataProvider, remoteDataProvider, contentType } ) => {
	const [ state, setState ] = useState( { data: [], error: null, isPending: true } );
	/** @type {import("react").MutableRefObject<AbortController>} */
	const controller = useRef();

	const endpoint = dataProvider.getEndpoint( "posts" );

	useEffect( () => {
		// Without an endpoint there is nothing to fetch; surface an empty, settled state.
		if ( ! endpoint ) {
			setState( { data: [], error: null, isPending: false } );
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
				// eslint-disable-next-line camelcase -- The REST endpoint expects snake_case query parameters.
				{ content_type: contentType, per_page: String( PAGE_SIZE ) },
				{ signal: current.signal }
			)
			.then( ( response ) => {
				if ( controller.current !== current ) {
					return;
				}
				setState( { data: ( response ?? [] ).map( formatPost ), error: null, isPending: false } );
			} )
			.catch( ( error ) => {
				// Ignore abort errors: they are expected when a newer request supersedes this one.
				if ( controller.current === current && error?.name !== "AbortError" ) {
					setState( { data: [], error, isPending: false } );
				}
			} );

		return () => current.abort();
	}, [ endpoint, contentType, remoteDataProvider ] );

	return state;
};
