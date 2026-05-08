import { beforeEach, describe, expect, it } from "@jest/globals";
import {
	CONTENT_OUTLINE_NAME,
	FETCH_CONTENT_OUTLINE_ACTION_NAME,
	contentOutlineControls,
	contentOutlineReducer,
	contentOutlineSelectors,
	fetchContentOutline,
	getInitialContentOutlineState,
} from "../../../src/ai-content-planner/store/content-outline";

jest.mock( "../../../src/ai-content-planner/helpers/fetch", () => ( {
	contentPlannerFetch: jest.fn(),
} ) );

const { contentPlannerFetch } = require( "../../../src/ai-content-planner/helpers/fetch" );
import { FETCH_CONTENT_SUGGESTIONS_ACTION_NAME } from "../../../src/ai-content-planner/store/content-suggestions";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";
import { ERROR_DEFAULT } from "../../../src/ai-content-planner/constants";

/* eslint-disable camelcase -- API field names use snake_case. */
const mockSuggestion = {
	id: "suggestion-dog training-How to train your dog",
	title: "How to train your dog",
	intent: "informational",
	keyphrase: "dog training",
	meta_description: "Learn how to train your dog.",
	category: "pets",
	explanation: "A guide to dog training basics.",
};
/* eslint-enable camelcase */

describe( "content outline store", () => {
	describe( "getInitialContentOutlineState", () => {
		it( "should return the initial state", () => {
			expect( getInitialContentOutlineState() ).toEqual( {
				suggestion: null,
				outline: [],
				cache: {},
				endpoint: "",
				status: ASYNC_ACTION_STATUS.idle,
				error: ERROR_DEFAULT,
			} );
		} );
	} );

	describe( "reducer", () => {
		describe( "setSuggestionForOutline", () => {
			it( "should set the suggestion", () => {
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{ type: `${ CONTENT_OUTLINE_NAME }/setSuggestionForOutline`, payload: mockSuggestion }
				);
				expect( result.suggestion ).toEqual( mockSuggestion );
			} );
		} );

		describe( "restoreContentOutlineFromCache", () => {
			it( "should restore suggestion and outline, set status to success and clear error", () => {
				const cachedOutline = [
					{ id: "0-Introduction", heading: "Introduction", contentNotes: [ "Write an intro" ] },
				];
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ CONTENT_OUTLINE_NAME }/restoreContentOutlineFromCache`,
						payload: { suggestion: mockSuggestion, outline: cachedOutline },
					}
				);
				expect( result.suggestion ).toEqual( mockSuggestion );
				expect( result.outline ).toEqual( cachedOutline );
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.success );
				expect( result.error ).toEqual( ERROR_DEFAULT );
			} );
		} );

		describe( "saveOutlineEditsToCache", () => {
			it( "should save structure to cache and reset state when id is provided", () => {
				const structure = [
					{ id: "0-Introduction", heading: "Introduction", contentNotes: [ "Intro note" ] },
				];
				const state = {
					...getInitialContentOutlineState(),
					suggestion: mockSuggestion,
					outline: structure,
					status: ASYNC_ACTION_STATUS.success,
				};
				const result = contentOutlineReducer(
					state,
					{
						type: `${ CONTENT_OUTLINE_NAME }/saveOutlineEditsToCache`,
						payload: { id: mockSuggestion.id, structure },
					}
				);
				expect( result.cache[ mockSuggestion.id ] ).toEqual( structure );
				expect( result.suggestion ).toBeNull();
				expect( result.outline ).toEqual( [] );
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.idle );
				expect( result.error ).toEqual( ERROR_DEFAULT );
			} );

			it( "should reset state without updating cache when id is falsy", () => {
				const state = {
					...getInitialContentOutlineState(),
					suggestion: mockSuggestion,
					outline: [ { id: "0-Intro", heading: "Intro", contentNotes: [] } ],
					status: ASYNC_ACTION_STATUS.success,
				};
				const result = contentOutlineReducer(
					state,
					{
						type: `${ CONTENT_OUTLINE_NAME }/saveOutlineEditsToCache`,
						payload: { id: null, structure: [] },
					}
				);
				expect( result.cache ).toEqual( {} );
				expect( result.suggestion ).toBeNull();
				expect( result.outline ).toEqual( [] );
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.idle );
				expect( result.error ).toEqual( ERROR_DEFAULT );
			} );
		} );

		describe( "fetchContentOutline extra reducers", () => {
			it( "should set status to loading, update suggestion and clear error on request", () => {
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
						payload: { suggestion: mockSuggestion },
					}
				);
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.loading );
				expect( result.suggestion ).toEqual( mockSuggestion );
				expect( result.error ).toEqual( ERROR_DEFAULT );
			} );

			it( "should normalize the snake_case API response and set status to success on success", () => {
				/* eslint-disable camelcase */
				const apiResponse = {
					outline: [
						{ subheading_text: "Introduction", content_notes: [ "Write an intro" ] },
						{ subheading_text: "Body", content_notes: [ "Add examples", "Add stats" ] },
					],
				};
				/* eslint-enable camelcase */
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
						payload: apiResponse,
					}
				);
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.success );
				expect( result.outline ).toEqual( [
					{ id: "0-Introduction", heading: "Introduction", contentNotes: [ "Write an intro" ] },
					{ id: "1-Body", heading: "Body", contentNotes: [ "Add examples", "Add stats" ] },
				] );
			} );

			it( "should fall back to empty strings and arrays when API response fields are missing", () => {
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
						payload: { outline: [ {} ] },
					}
				);
				expect( result.outline[ 0 ].heading ).toBe( "" );
				expect( result.outline[ 0 ].contentNotes ).toEqual( [] );
				expect( result.outline[ 0 ].id ).toBe( "0-" );
			} );

			it( "should set status to error and normalize the error on error", () => {
				const error = { errorCode: 500, errorIdentifier: "server_error", errorMessage: "Server error." };
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
						payload: error,
					}
				);
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.error );
				expect( result.error.errorCode ).toBe( 500 );
				expect( result.error.errorIdentifier ).toBe( "server_error" );
				expect( result.error.errorMessage ).toBe( "Server error." );
			} );

			it( "should default to errorCode 502 when the error payload has no errorCode", () => {
				const result = contentOutlineReducer(
					getInitialContentOutlineState(),
					{
						type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
						payload: { errorMessage: "Bad gateway." },
					}
				);
				expect( result.error.errorCode ).toBe( 502 );
			} );

			it( "should reset outline state but preserve endpoint when fetchContentPlannerSuggestions/request is dispatched", () => {
				const state = {
					...getInitialContentOutlineState(),
					endpoint: "yoast/v1/ai_content_planner/get_outline",
					suggestion: mockSuggestion,
					outline: [ { id: "0-Intro", heading: "Intro", contentNotes: [] } ],
					status: ASYNC_ACTION_STATUS.success,
					cache: { [ mockSuggestion.id ]: [] },
				};
				const result = contentOutlineReducer(
					state,
					{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` }
				);
				expect( result.endpoint ).toBe( "yoast/v1/ai_content_planner/get_outline" );
				expect( result.suggestion ).toBeNull();
				expect( result.outline ).toEqual( [] );
				expect( result.status ).toBe( ASYNC_ACTION_STATUS.idle );
				expect( result.error ).toEqual( ERROR_DEFAULT );
				expect( result.cache ).toEqual( {} );
			} );
		} );
	} );

	describe( "selectors", () => {
		const cachedOutline = [ { id: "0-Intro", heading: "Intro", contentNotes: [] } ];
		const fullState = {
			[ CONTENT_OUTLINE_NAME ]: {
				endpoint: "yoast/v1/ai_content_planner/get_outline",
				status: ASYNC_ACTION_STATUS.loading,
				outline: cachedOutline,
				error: ERROR_DEFAULT,
				suggestion: mockSuggestion,
				cache: { [ mockSuggestion.id ]: cachedOutline },
			},
		};

		it( "should return the endpoint from state", () => {
			expect( contentOutlineSelectors.selectContentOutlineEndpoint( fullState ) )
				.toBe( "yoast/v1/ai_content_planner/get_outline" );
		} );

		it( "should return an empty string for endpoint when state is missing", () => {
			expect( contentOutlineSelectors.selectContentOutlineEndpoint( {} ) ).toBe( "" );
		} );

		it( "should return the status from state", () => {
			expect( contentOutlineSelectors.selectContentOutlineStatus( fullState ) ).toBe( ASYNC_ACTION_STATUS.loading );
		} );

		it( "should return the default status when state is missing", () => {
			expect( contentOutlineSelectors.selectContentOutlineStatus( {} ) ).toBe( ASYNC_ACTION_STATUS.idle );
		} );

		it( "should return the outline from state", () => {
			expect( contentOutlineSelectors.selectContentOutline( fullState ) ).toEqual( cachedOutline );
		} );

		it( "should return an empty array for outline when state is missing", () => {
			expect( contentOutlineSelectors.selectContentOutline( {} ) ).toEqual( [] );
		} );

		it( "should return the error from state", () => {
			expect( contentOutlineSelectors.selectContentOutlineError( fullState ) ).toEqual( ERROR_DEFAULT );
		} );

		it( "should return the default error when state is missing", () => {
			expect( contentOutlineSelectors.selectContentOutlineError( {} ) ).toEqual( ERROR_DEFAULT );
		} );

		it( "should return the suggestion from state", () => {
			expect( contentOutlineSelectors.selectSuggestion( fullState ) ).toEqual( mockSuggestion );
		} );

		it( "should return null for suggestion when state is missing", () => {
			expect( contentOutlineSelectors.selectSuggestion( {} ) ).toBeNull();
		} );

		it( "should return the cached outline for a given id", () => {
			expect( contentOutlineSelectors.selectContentOutlineCache( fullState, mockSuggestion.id ) )
				.toEqual( cachedOutline );
		} );

		it( "should return null when no cache entry exists for the given id", () => {
			expect( contentOutlineSelectors.selectContentOutlineCache( fullState, "nonexistent-id" ) ).toBeNull();
		} );
	} );

	describe( "fetchContentOutline", () => {
		const params = {
			endpoint: "yoast/v1/ai_content_planner/get_outline",
			postType: "post",
			language: "en",
			editor: "gutenberg",
			suggestion: mockSuggestion,
		};

		it( "should yield a request action, a control action, a success action, then complete", () => {
			const generator = fetchContentOutline( params );

			// First yield: request action.
			const requestResult = generator.next();
			expect( requestResult.value ).toEqual( {
				type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				payload: { suggestion: mockSuggestion },
			} );
			expect( requestResult.done ).toBe( false );

			// Second yield: control action (triggers the fetch).
			const controlResult = generator.next();
			expect( controlResult.value ).toEqual( {
				type: FETCH_CONTENT_OUTLINE_ACTION_NAME,
				payload: {
					endpoint: params.endpoint,
					postType: params.postType,
					language: params.language,
					editor: params.editor,
					...mockSuggestion,
				},
			} );
			expect( controlResult.done ).toBe( false );

			// Third yield: success action with the simulated API response.
			// eslint-disable-next-line camelcase
			const apiResponse = { outline: [ { subheading_text: "Intro", content_notes: [] } ] };
			const successResult = generator.next( apiResponse );
			expect( successResult.value ).toEqual( {
				type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: apiResponse,
			} );
			expect( successResult.done ).toBe( false );

			// Generator completes after the success yield.
			const doneResult = generator.next();
			expect( doneResult.done ).toBe( true );
		} );

		it( "should yield an error action when the API call throws a non-aborted error", () => {
			const generator = fetchContentOutline( params );
			// Advance past request and control yields.
			generator.next();
			generator.next();

			const error = new Error( "Network error" );
			const errorResult = generator.throw( error );
			expect( errorResult.value ).toEqual( {
				type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				payload: error,
			} );
			expect( errorResult.done ).toBe( false );

			// Generator completes after the error yield.
			const doneResult = generator.next();
			expect( doneResult.done ).toBe( true );
		} );

		it( "should return early without yielding an error action when the error is aborted", () => {
			const generator = fetchContentOutline( params );
			// Advance past request and control yields.
			generator.next();
			generator.next();

			const abortedError = { aborted: true };
			const result = generator.throw( abortedError );
			expect( result.done ).toBe( true );
			expect( result.value ).toBeUndefined();
		} );
	} );

	describe( "controls", () => {
		beforeEach( () => {
			contentPlannerFetch.mockClear();
		} );

		it( "should call contentPlannerFetch with POST method and correct data fields", async() => {
			const payload = {
				endpoint: "yoast/v1/ai_content_planner/get_outline",
				postType: "post",
				language: "en",
				editor: "gutenberg",
				title: mockSuggestion.title,
				intent: mockSuggestion.intent,
				explanation: mockSuggestion.explanation,
				keyphrase: mockSuggestion.keyphrase,
				// eslint-disable-next-line camelcase
				meta_description: mockSuggestion.meta_description,
				category: mockSuggestion.category,
			};
			contentPlannerFetch.mockResolvedValue( { outline: [] } );

			await contentOutlineControls[ FETCH_CONTENT_OUTLINE_ACTION_NAME ]( { payload } );

			expect( contentPlannerFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					method: "POST",
					path: payload.endpoint,
				} )
			);
		} );
	} );
} );
