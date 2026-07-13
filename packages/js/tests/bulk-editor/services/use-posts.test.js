import { renderHook, waitFor } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { usePosts } from "../../../src/bulk-editor/services/use-posts";
import { PAGE_SIZE } from "../../../src/bulk-editor/constants";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn() } ) );

describe( "usePosts", () => {
	let dataProvider;
	let storeState;

	beforeEach( () => {
		dataProvider = { getEndpoint: jest.fn( () => "https://example.com/wp-json/yoast/v1/bulk_editor/posts" ) };
		storeState = { search: "", page: 1, statuses: [] };
		// Resolve each useSelect call against our controllable store state.
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( {
			selectSearch: () => storeState.search,
			selectPage: () => storeState.page,
			selectStatuses: () => storeState.statuses,
		} ) ) );
	} );

	it( "requests the posts endpoint with the content type, page size, page, search and statuses", async() => {
		storeState = { search: "seo", page: 2, statuses: [ "draft", "pending" ] };
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { posts: [] } ) ) };

		renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		await waitFor( () => expect( remoteDataProvider.fetchJson ).toHaveBeenCalled() );

		expect( dataProvider.getEndpoint ).toHaveBeenCalledWith( "posts" );
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/wp-json/yoast/v1/bulk_editor/posts",
			// eslint-disable-next-line camelcase -- The REST endpoint expects snake_case query parameters.
			{ content_type: "page", per_page: String( PAGE_SIZE ), page: "2", search: "seo", status: [ "draft", "pending" ] },
			expect.objectContaining( { signal: expect.anything() } )
		);
	} );

	it( "maps the snake_case API rows to camelCase bulk editor rows and exposes the totals", async() => {
		const remoteDataProvider = {
			/* eslint-disable camelcase -- The REST endpoint returns snake_case fields. */
			fetchJson: jest.fn( () => Promise.resolve( {
				posts: [
					{
						id: 7,
						title: "Hello world",
						status: "draft",
						edit_link: "post.php?post=7&action=edit",
						focus_keyphrase: "hello",
						seo_title: "Hello | Site",
						meta_description: "A description.",
						social_title: "Social hello",
						social_description: "Social description.",
						editable: true,
					},
				],
				total: 42,
				total_pages: 3,
			} ) ),
			/* eslint-enable camelcase -- The REST endpoint returns snake_case fields. */
		};

		const { result } = renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( result.current.data ).toEqual( [
			{
				id: 7,
				title: "Hello world",
				status: "draft",
				editLink: "post.php?post=7&action=edit",
				focusKeyphrase: "hello",
				seoTitle: "Hello | Site",
				metaDescription: "A description.",
				socialTitle: "Social hello",
				socialDescription: "Social description.",
				editable: true,
			},
		] );
		expect( result.current.total ).toBe( 42 );
		expect( result.current.totalPages ).toBe( 3 );
	} );

	it( "maps a missing response to an empty list", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve() ) };

		const { result } = renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( result.current.data ).toEqual( [] );
		expect( result.current.total ).toBe( 0 );
		expect( result.current.totalPages ).toBe( 0 );
	} );

	it( "exposes the error when the request fails", async() => {
		const error = new Error( "boom" );
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( error ) ) };

		const { result } = renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( result.current.error ).toBe( error );
		expect( result.current.data ).toEqual( [] );
	} );

	it( "ignores an aborted request and stays pending", async() => {
		const abortError = new Error( "aborted" );
		abortError.name = "AbortError";
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( abortError ) ) };

		const { result } = renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		await waitFor( () => expect( remoteDataProvider.fetchJson ).toHaveBeenCalled() );

		// An abort is expected when superseded by a newer request, so it must not surface as an error.
		expect( result.current.error ).toBeNull();
		expect( result.current.isPending ).toBe( true );
	} );

	it( "skips the request and settles empty when no endpoint is configured", () => {
		dataProvider = { getEndpoint: jest.fn( () => "" ) };
		const remoteDataProvider = { fetchJson: jest.fn() };

		const { result } = renderHook( () => usePosts( { dataProvider, remoteDataProvider, contentType: "page" } ) );

		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
		expect( result.current ).toMatchObject( { data: [], total: 0, totalPages: 0, error: null, isPending: false } );
		expect( typeof result.current.updateItem ).toBe( "function" );
	} );

	it( "ignores a superseded request that resolves after a newer one", async() => {
		const resolvers = {};
		const remoteDataProvider = {
			fetchJson: jest.fn( ( url, params ) => new Promise( ( resolve ) => {
				resolvers[ params.content_type ] = resolve;
			} ) ),
		};

		const { result, rerender } = renderHook(
			( { contentType } ) => usePosts( { dataProvider, remoteDataProvider, contentType } ),
			{ initialProps: { contentType: "page" } }
		);

		// Supersede the "page" request before it settles.
		rerender( { contentType: "post" } );

		// The newer request settles first, then the stale one resolves late.
		resolvers.post( { posts: [ { id: 2, title: "Post" } ] } );
		await waitFor( () => expect( result.current.isPending ).toBe( false ) );
		resolvers.page( { posts: [ { id: 1, title: "Page" } ] } );
		// Flush the stale promise's then-callback before asserting.
		await waitFor( () => expect( result.current.data ).toHaveLength( 1 ) );

		expect( result.current.data[ 0 ] ).toMatchObject( { id: 2, title: "Post" } );
	} );
} );
