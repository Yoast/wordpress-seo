import { describe, expect, it, jest } from "@jest/globals";
import apiFetch from "@wordpress/api-fetch";
import { FETCH_RESPONSE_STATUS } from "../../../src/ai-generator/constants";
import { fetchSuggestions } from "../../../src/ai-generator/helpers/fetch-suggestions";

jest.mock( "@wordpress/api-fetch" );

describe( "fetchSuggestions", () => {
	it( "should call fetch suggestions", async() => {
		apiFetch.mockImplementation( () => Promise.resolve( {
			json: () => Promise.resolve( { code: 200, message: "We have suggestions" } ),
		} ) );

		const result = await fetchSuggestions( {
			type: "seo-title",
			promptContent: "someContent",
			focusKeyphrase: "someKeyphrase",
			platform: "Google",
			language: "en_US",
		} );

		expect( result ).toEqual( {
			status: FETCH_RESPONSE_STATUS.success,
			payload: { code: 200, message: "We have suggestions" },
		} );
	} );

	it( "should call fetch suggestions with error", async() => {
		apiFetch.mockImplementation( () => Promise.resolve( {
			json: () => Promise.reject( { code: 500, message: "We have an error" } ),
		} ) );

		const result = await fetchSuggestions( {
			type: "seo-title",
			promptContent: "someContent",
			focusKeyphrase: "someKeyphrase",
			platform: "Google",
			language: "en_US",
		} );

		expect( result ).toEqual( {
			status: FETCH_RESPONSE_STATUS.error,
			payload: { code: 500, message: "Unknown" },
		} );
	} );

	it( "should call fetch suggestions with DOMException error", async() => {
		apiFetch.mockImplementation( () => Promise.reject(
			new DOMException( "Mocked DOMException message", "AbortError" )
		) );

		const result = await fetchSuggestions( {
			type: "seo-title",
			promptContent: "someContent",
			focusKeyphrase: "someKeyphrase",
			platform: "Google",
			language: "en_US",
		} );

		expect( result ).toEqual( {
			status: FETCH_RESPONSE_STATUS.abort,
		} );
	} );

	it( "should call fetch suggestions with DOMException error and timeout", ( done ) => {
		apiFetch.mockImplementation( () => Promise.reject(
			new DOMException( "Mocked DOMException message", "AbortError" )
		) );

		fetchSuggestions( {
			type: "meta-description",
			promptContent: "someContent",
			focusKeyphrase: "someKeyphrase",
			platform: "Google",
			language: "en_US",
		} ).then( result => {
			expect( result ).toEqual( {
				status: FETCH_RESPONSE_STATUS.error,
				payload: { message: "timeout", code: 408 },
			} );

			done();
		} );

		jest.advanceTimersByTime( 30000 );
	} );
} );
