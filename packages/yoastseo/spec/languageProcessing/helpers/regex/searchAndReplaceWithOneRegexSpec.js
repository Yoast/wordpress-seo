import searchAndReplaceWithOneRegex from "../../../../src/languageProcessing/helpers/regex/searchAndReplaceWithOneRegex";

describe( "A test to apply one regex suffix to a stem", () => {
	it( "Appends a suffixes to a stem", () => {
		expect( searchAndReplaceWithOneRegex( "balletje", [ "(et)(je)$", "$1" ] ) ).toEqual( "ballet" );
	} );

	it( "Returns null if there is no match", () => {
		expect( searchAndReplaceWithOneRegex( "balletje", [ "(nn)(en)$", "$1" ] ) ).toBeUndefined();
	} );
} );
