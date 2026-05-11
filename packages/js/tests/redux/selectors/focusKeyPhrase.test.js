jest.mock( "@wordpress/hooks", () => ( {
	applyFilters: jest.fn( ( _hook, defaultValue ) => defaultValue ),
} ) );

import { applyFilters } from "@wordpress/hooks";
import { getFocusKeyphraseErrors } from "../../../src/redux/selectors/focusKeyPhrase";

afterEach( () => {
	applyFilters.mockReset();
} );

describe( "getFocusKeyphraseErrors", () => {
	it( "returns an empty array when the filter adds no errors", () => {
		applyFilters.mockReturnValue( [] );

		expect( getFocusKeyphraseErrors( { focusKeyword: "seo-1" } ) ).toEqual( [] );
	} );

	it( "returns string errors provided by the filter", () => {
		applyFilters.mockReturnValue( [ "Too short.", "Too generic." ] );

		expect( getFocusKeyphraseErrors( { focusKeyword: "seo-2" } ) ).toEqual( [ "Too short.", "Too generic." ] );
	} );

	it( "filters out non-string values from the filter result", () => {
		applyFilters.mockReturnValue( [ "Valid error.", 42, null, true ] );

		expect( getFocusKeyphraseErrors( { focusKeyword: "seo-3" } ) ).toEqual( [ "Valid error." ] );
	} );

	it( "returns an empty array when the filter returns a non-array", () => {
		applyFilters.mockReturnValue( "not an array" );

		expect( getFocusKeyphraseErrors( { focusKeyword: "seo-4" } ) ).toEqual( [] );
	} );

	it( "returns the same array reference when called twice with the same keyword", () => {
		applyFilters.mockReturnValue( [ "An error." ] );
		const state = { focusKeyword: "seo-ref-stable" };

		const first = getFocusKeyphraseErrors( state );
		const second = getFocusKeyphraseErrors( state );

		expect( second ).toBe( first );
	} );

	it( "returns a new array reference when the keyword changes", () => {
		applyFilters.mockReturnValue( [ "An error." ] );

		const first = getFocusKeyphraseErrors( { focusKeyword: "seo-new-a" } );
		const second = getFocusKeyphraseErrors( { focusKeyword: "seo-new-b" } );

		expect( second ).not.toBe( first );
	} );

	it( "passes the focus keyword to applyFilters", () => {
		applyFilters.mockReturnValue( [] );

		getFocusKeyphraseErrors( { focusKeyword: "yoast seo" } );

		expect( applyFilters ).toHaveBeenCalledWith( "yoast.focusKeyphrase.errors", [], "yoast seo" );
	} );
} );
