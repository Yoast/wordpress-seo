import { beforeEach, describe, expect, it } from "@jest/globals";
import {
	CONTENT_SUGGESTIONS_NAME,
	FETCH_CONTENT_SUGGESTIONS_ACTION_NAME,
	contentSuggestionsControls,
	contentSuggestionsReducer,
	contentSuggestionsSelectors,
	fetchContentPlannerSuggestions,
	getInitialContentSuggestionsState,
} from "../../../src/ai-content-planner/store/content-suggestions";

jest.mock( "../../../src/ai-content-planner/helpers/fetch", () => ( {
	contentPlannerFetch: jest.fn(),
} ) );

jest.mock( "@wordpress/url", () => ( {
	addQueryArgs: jest.fn( ( path, args ) => `${ path }?${ new URLSearchParams( args ).toString() }` ),
} ) );

const { contentPlannerFetch } = require( "../../../src/ai-content-planner/helpers/fetch" );

import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";

const ERROR_DEFAULT = {
	errorCode: null,
	errorIdentifier: null,
	errorMessage: null,
	missingLicenses: [],
};

/* eslint-disable camelcase -- API field names use snake_case. */
const mockApiSuggestions = [
	{
		intent: "informational",
		title: "How to train your dog",
		explanation: "A guide to dog training basics.",
		keyphrase: "dog training",
		meta_description: "Learn how to train your dog.",
		category: "pets",
	},
	{
		intent: "commercial",
		title: "Best dog food brands",
		explanation: "Top picks for dog food.",
		keyphrase: "best dog food",
		meta_description: "Find the best dog food brands.",
		category: "pets",
	},
];
/* eslint-enable camelcase */

const transformedSuggestions = [
	{
		intent: "informational",
		title: "How to train your dog",
		explanation: "A guide to dog training basics.",
		keyphrase: "dog training",
		// eslint-disable-next-line camelcase
		meta_description: "Learn how to train your dog.",
		category: "pets",
		id: "suggestion-dog training-How to train your dog",
	},
	{
		intent: "commercial",
		title: "Best dog food brands",
		explanation: "Top picks for dog food.",
		keyphrase: "best dog food",
		// eslint-disable-next-line camelcase
		meta_description: "Find the best dog food brands.",
		category: "pets",
		id: "suggestion-best dog food-Best dog food brands",
	},
];

describe( "suggestions store", () => {
	describe( "getInitialContentSuggestionsState", () => {
		it( "should return the initial state", () => {
			expect( getInitialContentSuggestionsState() ).toEqual( {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.idle,
				suggestions: [],
				error: ERROR_DEFAULT,
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "should set status to loading and clear suggestions on request", () => {
			const previousState = {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.success,
				suggestions: transformedSuggestions,
				error: ERROR_DEFAULT,
			};

			const result = contentSuggestionsReducer(
				previousState,
				{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` }
			);

			expect( result ).toEqual( {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.loading,
				suggestions: [],
				error: ERROR_DEFAULT,
			} );
		} );

		it( "should set suggestions and status to success on success", () => {
			const result = contentSuggestionsReducer(
				getInitialContentSuggestionsState(),
				{
					type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
					payload: transformedSuggestions,
				}
			);

			expect( result ).toEqual( {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.success,
				suggestions: transformedSuggestions,
				error: ERROR_DEFAULT,
			} );
		} );

		it( "should set error and status to error on error", () => {
			const error = {
				errorCode: 403,
				errorIdentifier: "forbidden",
				errorMessage: "Access denied.",
			};

			const result = contentSuggestionsReducer(
				getInitialContentSuggestionsState(),
				{
					type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
					payload: error,
				}
			);

			expect( result ).toEqual( {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.error,
				suggestions: [],
				error: {
					errorCode: 403,
					errorIdentifier: "forbidden",
					errorMessage: "Access denied.",
					missingLicenses: [],
				},
			} );
		} );

		it( "should default to errorCode 502 when the error payload has no errorCode", () => {
			const result = contentSuggestionsReducer(
				getInitialContentSuggestionsState(),
				{
					type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
					payload: { errorMessage: "Bad gateway." },
				}
			);

			expect( result.error.errorCode ).toBe( 502 );
		} );

		it( "setContentSuggestionsStatus sets the status to the given value", () => {
			const result = contentSuggestionsReducer(
				getInitialContentSuggestionsState(),
				{
					type: `${ CONTENT_SUGGESTIONS_NAME }/setContentSuggestionsStatus`,
					payload: ASYNC_ACTION_STATUS.loading,
				}
			);
			expect( result.status ).toBe( ASYNC_ACTION_STATUS.loading );
		} );

		it( "setSuggestion updates an existing suggestion by id", () => {
			const updatedSuggestion = { ...transformedSuggestions[ 0 ], title: "Updated Title" };
			const previousState = {
				...getInitialContentSuggestionsState(),
				suggestions: transformedSuggestions,
			};
			const result = contentSuggestionsReducer( previousState, {
				type: `${ CONTENT_SUGGESTIONS_NAME }/setSuggestion`,
				payload: updatedSuggestion,
			} );
			expect( result.suggestions[ 0 ].title ).toBe( "Updated Title" );
		} );

		it( "setSuggestion does not change state when the id does not match any suggestion", () => {
			const previousState = {
				...getInitialContentSuggestionsState(),
				suggestions: transformedSuggestions,
			};
			const result = contentSuggestionsReducer( previousState, {
				type: `${ CONTENT_SUGGESTIONS_NAME }/setSuggestion`,
				payload: { id: "nonexistent-id", title: "Ghost" },
			} );
			expect( result.suggestions ).toEqual( transformedSuggestions );
		} );

		it( "setSuggestionsError sets the error state without an API call, clearing any prior suggestions", () => {
			const previousState = {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.success,
				suggestions: transformedSuggestions,
				error: ERROR_DEFAULT,
			};

			const result = contentSuggestionsReducer( previousState, {
				type: `${ CONTENT_SUGGESTIONS_NAME }/setSuggestionsError`,
				payload: {
					errorCode: 402,
					errorIdentifier: "PAYMENT_REQUIRED",
					missingLicenses: [ "Yoast SEO Premium" ],
				},
			} );

			expect( result ).toEqual( {
				endpoint: "",
				status: ASYNC_ACTION_STATUS.error,
				suggestions: [],
				error: {
					errorCode: 402,
					errorIdentifier: "PAYMENT_REQUIRED",
					errorMessage: "",
					missingLicenses: [ "Yoast SEO Premium" ],
				},
			} );
		} );
	} );

	describe( "selectors", () => {
		it( "should return the endpoint from state", () => {
			const state = {
				[ CONTENT_SUGGESTIONS_NAME ]: {
					endpoint: "yoast/v1/ai_content_planner/get_suggestions",
					status: ASYNC_ACTION_STATUS.idle,
					suggestions: [],
					error: ERROR_DEFAULT,
				},
			};

			expect( contentSuggestionsSelectors.selectContentSuggestionsEndpoint( state ) )
				.toBe( "yoast/v1/ai_content_planner/get_suggestions" );
		} );

		it( "should return an empty string when endpoint state is missing", () => {
			expect( contentSuggestionsSelectors.selectContentSuggestionsEndpoint( {} ) ).toBe( "" );
		} );

		it( "should return the suggestions status from state", () => {
			const state = {
				[ CONTENT_SUGGESTIONS_NAME ]: {
					status: ASYNC_ACTION_STATUS.loading,
					suggestions: [],
					error: ERROR_DEFAULT,
				},
			};

			expect( contentSuggestionsSelectors.selectSuggestionsStatus( state ) ).toBe( ASYNC_ACTION_STATUS.loading );
		} );

		it( "should return the default status when state is missing", () => {
			expect( contentSuggestionsSelectors.selectSuggestionsStatus( {} ) ).toBe( ASYNC_ACTION_STATUS.idle );
		} );

		it( "should return suggestions from state", () => {
			const state = {
				[ CONTENT_SUGGESTIONS_NAME ]: {
					status: ASYNC_ACTION_STATUS.success,
					suggestions: transformedSuggestions,
					error: ERROR_DEFAULT,
				},
			};

			expect( contentSuggestionsSelectors.selectSuggestions( state ) ).toEqual( transformedSuggestions );
		} );

		it( "should return the default suggestions when state is missing", () => {
			expect( contentSuggestionsSelectors.selectSuggestions( {} ) ).toEqual( [] );
		} );

		it( "should return the error from state", () => {
			const error = { errorCode: 500, errorIdentifier: null, errorMessage: "Server error." };
			const state = {
				[ CONTENT_SUGGESTIONS_NAME ]: {
					status: ASYNC_ACTION_STATUS.error,
					suggestions: [],
					error,
				},
			};

			expect( contentSuggestionsSelectors.selectSuggestionsError( state ) ).toEqual( error );
		} );

		it( "should return the default error when state is missing", () => {
			expect( contentSuggestionsSelectors.selectSuggestionsError( {} ) ).toEqual( ERROR_DEFAULT );
		} );
	} );

	describe( "fetchContentPlannerSuggestions", () => {
		const params = {
			endpoint: "yoast/v1/ai_content_planner/get_suggestions",
			postType: "post",
			language: "en",
			editor: "gutenberg",
		};

		it( "should yield a request action, then return a success action with transformed suggestions", () => {
			const generator = fetchContentPlannerSuggestions( params );

			// First yield: request action.
			const requestAction = generator.next();
			expect( requestAction.value ).toEqual( {
				type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
			} );

			// Second yield: control action (triggers apiFetch). Simulate API returning raw data.
			const controlAction = generator.next( requestAction.value );
			expect( controlAction.value ).toEqual( {
				type: FETCH_CONTENT_SUGGESTIONS_ACTION_NAME,
				payload: params,
			} );

			// Simulate the API response being returned from the control.
			const result = generator.next( { suggestions: mockApiSuggestions } );
			expect( result.value ).toEqual( {
				type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				payload: transformedSuggestions,
			} );
			expect( result.done ).toBe( true );
		} );

		it( "should return an error action when the API call throws", () => {
			const generator = fetchContentPlannerSuggestions( params );

			// First yield: request action.
			generator.next();
			// Second yield: control action.
			generator.next();

			// Simulate the API throwing an error.
			const error = new Error( "Network error" );
			error.code = 500;
			const result = generator.throw( error );

			expect( result.value ).toEqual( {
				type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				payload: error,
			} );
			expect( result.done ).toBe( true );
		} );

		it( "should return an error action when the response has no suggestions array", () => {
			const generator = fetchContentPlannerSuggestions( params );

			// First yield: request action.
			generator.next();
			// Second yield: control action.
			generator.next();

			// Simulate API returning an invalid response.
			const result = generator.next( { data: "not an array" } );
			expect( result.value.type ).toBe( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }` );
			expect( result.value.payload ).toBeInstanceOf( Error );
			expect( result.value.payload.message ).toBe( "Invalid suggestions response: expected an array of suggestions." );
			expect( result.done ).toBe( true );
		} );

		it( "should return early without yielding an error action when the error is aborted", () => {
			const generator = fetchContentPlannerSuggestions( params );

			// First yield: request action.
			generator.next();
			// Second yield: control action.
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

		it( "should call contentPlannerFetch with the correct path including query args", async() => {
			const payload = {
				endpoint: "yoast/v1/ai_content_planner/get_suggestions",
				postType: "post",
				language: "en",
				editor: "gutenberg",
			};
			contentPlannerFetch.mockResolvedValue( { suggestions: [] } );

			await contentSuggestionsControls[ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME ]( { payload } );

			expect( contentPlannerFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( payload.endpoint ),
				} )
			);
		} );
	} );
} );
