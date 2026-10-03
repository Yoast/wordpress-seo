import { beforeEach, describe, expect, it } from "@jest/globals";
import apiFetch from "@wordpress/api-fetch";
import indexablePagesReducer, {
	createInitialIndexablePagesState,
	FETCH_INDEXABLE_PAGES_ACTION_NAME,
	INDEXABLE_PAGE_NAME,
	indexablePagesActions,
	indexablePagesControls,
	indexablePagesSelectors,
} from "../../../src/settings/store/indexable-pages";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";
import { withConsoleErrorMock } from "../../test-utils";

describe( "actions", () => {
	describe( "addIndexablePages", () => {
		it( "exists", () => {
			expect( indexablePagesActions.addIndexablePages ).toBeTruthy();
		} );

		it( "creates an addIndexablePages action object, preparing for the store", () => {
			const action = indexablePagesActions.addIndexablePages( [
				{ id: 1, title: "Default", slug: "default" },
				{ id: 2, title: "  Decoded &aacute; and trimmed  ", slug: "decoded" },
				{ id: 3, slug: "no-title" },
				{ id: 4 },
				{ title: "No ID", slug: "no-id" },
				{ id: "123" },
				{ id: 8, slug: 456 },
				{},
			] );
			expect( action ).toEqual( {
				type: `${ INDEXABLE_PAGE_NAME }/addIndexablePages`,
				payload: [
					{ id: 1, name: "Default", slug: "default" },
					{ id: 2, name: "Decoded á and trimmed", slug: "decoded" },
					{ id: 3, name: "no-title", slug: "no-title" },
					{ id: 4, name: "4", slug: "" },
					{ id: 0, name: "No ID", slug: "no-id" },
					{ id: 123, name: "123", slug: "" },
					{ id: 8, name: "456", slug: "456" },
					{ id: 0, name: "0", slug: "" },
				],
			} );
		} );
	} );

	describe( "fetchIndexablePages", () => {
		it( "exists", () => {
			expect( indexablePagesActions.fetchIndexablePages ).toBeTruthy();
		} );

		it( "creates multiple fetchIndexablePages action objects", () => {
			const generator = indexablePagesActions.fetchIndexablePages( "id", { search: "foo" } );

			// Initial request action.
			let result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value ).toEqual( {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				payload: {
					scope: "id",
					query: { search: "foo" },
				},
			} );

			result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value ).toEqual( {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }`,
				payload: {
					scope: "id",
					query: { search: "foo" },
					abortController: null,
				},
			} );

			result = generator.next();
			expect( result.done ).toBe( true );
			expect( result.value ).toEqual( {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: {
					scope: "id",
					query: { search: "foo" },
					// There is no control side-effect here, so the response is undefined.
					pages: undefined,
				},
			} );
		} );

		it( "creates error action when apiFetch rejects", () => withConsoleErrorMock( ( consoleError ) => {
			const generator = indexablePagesActions.fetchIndexablePages( "id", { search: "foo" } );

			let result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value?.type ).toEqual( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` );

			result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value?.type ).toEqual( FETCH_INDEXABLE_PAGES_ACTION_NAME );

			// As controls don't work in our mocked environment, we simulate the error by making the generator throw an error.
			result = generator.throw( "Foo" );
			expect( result.done ).toBe( true );
			expect( result.value ).toEqual( {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				payload: { scope: "id" },
			} );
			expect( consoleError ).toHaveBeenCalledWith( "Error fetching indexable pages:", "Foo" );
		} ) );

		it( "creates an empty action when apiFetch rejects with an AbortError", () => withConsoleErrorMock( ( consoleError ) => {
			const generator = indexablePagesActions.fetchIndexablePages( "id", { search: "foo" } );

			let result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value?.type ).toEqual( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` );

			result = generator.next();
			expect( result.done ).toBe( false );
			expect( result.value?.type ).toEqual( FETCH_INDEXABLE_PAGES_ACTION_NAME );

			// As controls don't work in our mocked environment, we simulate the error by making the generator throw an error.
			const abortError = new Error( "Foo" );
			abortError.name = "AbortError";
			result = generator.throw( abortError );
			expect( result.done ).toBe( true );
			expect( result.value ).toEqual( {} );
			expect( consoleError ).not.toHaveBeenCalledWith( "Error fetching indexable pages:", "Foo" );
		} ) );
	} );

	describe( "removeIndexablePagesScope", () => {
		it( "exists", () => {
			expect( indexablePagesActions.removeIndexablePagesScope ).toBeTruthy();
		} );

		it( "creates an removeIndexablePagesScope action object", () => {
			const action = indexablePagesActions.removeIndexablePagesScope( "foo" );
			expect( action ).toEqual( {
				type: `${ INDEXABLE_PAGE_NAME }/removeIndexablePagesScope`,
				payload: "foo",
			} );
		} );
	} );
} );

describe( "initial state", () => {
	it( "has a default state", () => {
		expect( createInitialIndexablePagesState() ).toEqual( {
			ids: [],
			entities: {},
			scopes: {},
		} );
	} );
} );

describe( "reducer", () => {
	it( "returns the initial state", () => {
		expect( indexablePagesReducer( undefined, {} ) ).toEqual( createInitialIndexablePagesState() );
	} );

	describe( "addIndexablePages", () => {
		it( "adds indexable pages to the state", () => {
			const initialState = createInitialIndexablePagesState();
			const action = indexablePagesActions.addIndexablePages( [
				{ id: 1, title: "Page One", slug: "page-one" },
				{ id: 2, title: "Page Two", slug: "page-two" },
			] );
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.ids ).toEqual( [ 1, 2 ] );
			expect( newState.entities[ 1 ] ).toEqual( { id: 1, name: "Page One", slug: "page-one" } );
			expect( newState.entities[ 2 ] ).toEqual( { id: 2, name: "Page Two", slug: "page-two" } );
		} );

		it( "updates existing indexable pages", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.ids = [ 1 ];
			initialState.entities[ 1 ] = { id: 1, name: "Page One", slug: "page-one" };
			const action = indexablePagesActions.addIndexablePages( [
				{ id: 1, title: "Page One Update", slug: "page-one-update" },
			] );
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.ids ).toEqual( [ 1 ] );
			expect( newState.entities[ 1 ] ).toEqual( { id: 1, name: "Page One Update", slug: "page-one-update" } );
		} );
	} );

	describe( "removeIndexablePagesScope", () => {
		beforeEach( () => {
			apiFetch.mockClear();
		} );

		it( "removes a scope from the state", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.scopes = {
				testScope: {
					query: { search: "" },
					status: ASYNC_ACTION_STATUS.idle,
					ids: [],
				},
			};
			const action = indexablePagesActions.removeIndexablePagesScope( "testScope" );
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes ).toEqual( {} );
		} );

		it( "does nothing if the scope does not exist", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.scopes = {
				testScope: {
					query: { search: "" },
					status: ASYNC_ACTION_STATUS.idle,
					ids: [],
				},
			};
			const action = indexablePagesActions.removeIndexablePagesScope( "nonExistentScope" );
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes ).toEqual( initialState.scopes );
		} );

		it( "aborts the request if the scope is still loading", ( done ) => {
			const initialState = createInitialIndexablePagesState();
			initialState.scopes = {
				testScope: {
					query: { search: "" },
					// The request is still in progress.
					status: ASYNC_ACTION_STATUS.loading,
					ids: [],
				},
			};

			// Mock the request to stay in progress: timeout means the request did not get aborted.
			apiFetch.mockImplementationOnce( ( { signal } ) => new Promise( ( resolve ) => {
				// We need to listen for the abort signal to resolve the promise.
				signal.addEventListener( "abort", resolve );
			} ) );

			// Calling the control adds an abort controller for the scope.
			indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]( { payload: { scope: "testScope", query: { search: "foo" } } } )
				.finally( () => {
					// If the request is aborted, it should not resolve here.
					expect( apiFetch ).toHaveBeenNthCalledWith(
						1,
						expect.objectContaining( {
							path: "/yoast/v1/available_posts?search=foo",
							signal: expect.any( AbortSignal ),
						} )
					);

					// Once the request is aborted, the test is done.
					done();
				} );

			// Remove the scope so the request is still in progress.
			const action = indexablePagesActions.removeIndexablePagesScope( "testScope" );
			const newState = indexablePagesReducer( initialState, action );
			expect( newState.scopes ).toEqual( {} );
		} );
	} );

	describe( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, () => {
		it( "adds the scope, with a loading status", () => {
			const initialState = createInitialIndexablePagesState();
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				payload: { scope: "testScope" },
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes.testScope ).toEqual( {
				query: { search: "" },
				status: ASYNC_ACTION_STATUS.loading,
				ids: [],
			} );
		} );

		it( "adapts the status and query for existing scopes", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.scopes = {
				existingScope: {
					query: { search: "existing" },
					status: ASYNC_ACTION_STATUS.idle,
					ids: [ 1, 2, 3 ],
				},
			};
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				payload: { scope: "existingScope", query: { search: "foo" } },
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes.existingScope ).toEqual( {
				query: { search: "foo" },
				status: ASYNC_ACTION_STATUS.loading,
				ids: [ 1, 2, 3 ],
			} );
		} );
	} );

	describe( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, () => {
		it( "adds the fetched indexable pages to the state", () => {
			const initialState = createInitialIndexablePagesState();
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: {
					scope: "testScope",
					query: { search: "foo" },
					pages: [
						{ id: 1, title: "Page One", slug: "page-one" },
						{ id: 2, title: "Page Two", slug: "page-two" },
					],
				},
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.ids ).toEqual( [ 1, 2 ] );
			expect( newState.entities[ 1 ] ).toEqual( { id: 1, name: "Page One", slug: "page-one" } );
			expect( newState.entities[ 2 ] ).toEqual( { id: 2, name: "Page Two", slug: "page-two" } );
			expect( newState.scopes.testScope ).toEqual( {
				query: { search: "foo" },
				status: ASYNC_ACTION_STATUS.success,
				ids: [ 1, 2 ],
			} );
		} );

		it( "combines new pages with existing ones", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.ids = [ 1 ];
			initialState.entities[ 1 ] = { id: 1, name: "Page One", slug: "page-one" };
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: {
					scope: "testScope",
					query: { search: "foo" },
					pages: [
						{ id: 2, title: "Page Two", slug: "page-two" },
					],
				},
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.ids ).toEqual( [ 1, 2 ] );
			expect( newState.entities[ 1 ] ).toEqual( { id: 1, name: "Page One", slug: "page-one" } );
			expect( newState.entities[ 2 ] ).toEqual( { id: 2, name: "Page Two", slug: "page-two" } );
			expect( newState.scopes.testScope ).toEqual( {
				query: { search: "foo" },
				status: ASYNC_ACTION_STATUS.success,
				ids: [ 2 ],
			} );
		} );

		it( "updates the existing indexable pages in the state", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.ids = [ 1 ];
			initialState.entities[ 1 ] = { id: 1, name: "Page One", slug: "page-one" };
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: {
					scope: "testScope",
					query: { search: "foo" },
					pages: [
						{ id: 1, title: "Page One Update", slug: "page-one-update" },
					],
				},
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.ids ).toEqual( [ 1 ] );
			expect( newState.entities[ 1 ] ).toEqual( { id: 1, name: "Page One Update", slug: "page-one-update" } );
			expect( newState.scopes.testScope ).toEqual( {
				query: { search: "foo" },
				status: ASYNC_ACTION_STATUS.success,
				ids: [ 1 ],
			} );
		} );
	} );

	describe( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, () => {
		it( "sets the scope status to error", () => {
			const initialState = createInitialIndexablePagesState();
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				payload: { scope: "testScope" },
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes.testScope ).toEqual( {
				query: { search: "" },
				status: ASYNC_ACTION_STATUS.error,
				ids: [],
			} );
		} );

		it( "does not change the query or ids in the scope", () => {
			const initialState = createInitialIndexablePagesState();
			initialState.scopes = {
				testScope: {
					query: { search: "foo" },
					status: ASYNC_ACTION_STATUS.loading,
					ids: [ 1, 2 ],
				},
			};
			const action = {
				type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				payload: { scope: "testScope" },
			};
			const newState = indexablePagesReducer( initialState, action );

			expect( newState.scopes.testScope.query ).toEqual( { search: "foo" } );
			expect( newState.scopes.testScope.ids ).toEqual( [ 1, 2 ] );
		} );
	} );
} );

describe( "selectors", () => {
	const mockState = Object.freeze( {
		[ INDEXABLE_PAGE_NAME ]: {
			ids: [ 123, 456 ],
			entities: {
				123: {
					id: 123,
					name: "Test Page",
					slug: "test-page",
				},
				456: {
					id: 456,
					name: "Another Page",
					slug: "another-page",
				},
			},
			scopes: {
				testScope: {
					query: { search: "test" },
					status: ASYNC_ACTION_STATUS.success,
					ids: [ 123 ],
				},
			},
		},
	} );

	describe( "selectIndexablePageById", () => {
		it( "exists", () => {
			expect( indexablePagesSelectors.selectIndexablePageById ).toBeTruthy();
		} );

		it( "returns the entity of the given ID", () => {
			expect( indexablePagesSelectors.selectIndexablePageById( mockState, 123 ) )
				.toEqual( mockState[ INDEXABLE_PAGE_NAME ].entities[ 123 ] );
		} );

		it( "returns undefined if no entity matches the given ID", () => {
			expect( indexablePagesSelectors.selectIndexablePageById( mockState, 124 ) ).toBeUndefined();
		} );
	} );

	describe( "selectIndexablePagesScope", () => {
		it( "exists", () => {
			expect( indexablePagesSelectors.selectIndexablePagesScope ).toBeTruthy();
		} );

		it( "returns the scope with the given ID", () => {
			expect( indexablePagesSelectors.selectIndexablePagesScope( mockState, "testScope" ) ).toEqual( {
				query: { search: "test" },
				status: ASYNC_ACTION_STATUS.success,
				ids: [ 123 ],
			} );
		} );

		it( "returns empty scope with all ids if no scope matches the given ID", () => {
			expect( indexablePagesSelectors.selectIndexablePagesScope( mockState ) ).toEqual( {
				query: { search: "" },
				status: ASYNC_ACTION_STATUS.idle,
				ids: mockState[ INDEXABLE_PAGE_NAME ].ids,
			} );
		} );
	} );

	describe( "selectIndexablePagesById", () => {
		it( "exists", () => {
			expect( indexablePagesSelectors.selectIndexablePagesById ).toBeTruthy();
		} );

		it( "returns the indexable pages with the given IDs", () => {
			expect( indexablePagesSelectors.selectIndexablePagesById( mockState, [ 456 ] ) )
				.toEqual( [ mockState[ INDEXABLE_PAGE_NAME ].entities[ 456 ] ] );
		} );

		it( "returns an empty array if no IDs match", () => {
			expect( indexablePagesSelectors.selectIndexablePagesById( mockState, [ 1 ] ) ).toEqual( [] );
		} );
	} );
} );

describe( "controls", () => {
	describe( FETCH_INDEXABLE_PAGES_ACTION_NAME, () => {
		beforeEach( () => {
			apiFetch.mockClear();
		} );

		it( "exists", () => {
			expect( indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ] ).toBeTruthy();
		} );

		it( "calls apiFetch with the search query", async() => {
			apiFetch.mockResolvedValueOnce( [] );

			const actual = await indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]( {
				payload: {
					scope: "test",
					query: { search: "foo" },
				},
			} );

			expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( {
				path: "/yoast/v1/available_posts?search=foo",
				signal: expect.any( AbortSignal ),
			} ) );
			expect( actual ).toEqual( [] );
		} );

		it( "stops the previous request from the same scope", async() => {
			// Mock the first request to stay in progress: timeout means the request did not get aborted.
			apiFetch.mockReturnValueOnce( new Promise( () => {
			} ) );
			apiFetch.mockResolvedValueOnce( [] );

			indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]( { payload: { scope: "", query: { search: "first" } } } );
			const actual = await indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]( {
				payload: {
					scope: "",
					query: { search: "second" },
				},
			} );

			expect( apiFetch ).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining( {
					path: "/yoast/v1/available_posts?search=first",
					signal: expect.any( AbortSignal ),
				} )
			);
			expect( apiFetch ).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining( {
					path: "/yoast/v1/available_posts?search=second",
					signal: expect.any( AbortSignal ),
				} )
			);
			expect( actual ).toEqual( [] );
		} );

		test.each( [
			[ null ],
			[ undefined ],
		] )( "throws a TypeError when passing %p", async( input ) => {
			expect.assertions( 2 );
			try {
				await indexablePagesControls[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]( input );
			} catch ( e ) {
				expect( e ).toBeInstanceOf( TypeError );
			}
			expect( apiFetch ).toHaveBeenCalledTimes( 0 );
		} );
	} );
} );
