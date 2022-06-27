import textLength from "../../../../../src/languageProcessing/languages/ja/customResearches/textLength";
import Paper from "../../../../../src/values/Paper";

describe( "counts characters in a string", function() {
	const paper = new Paper( "こんにちは。" );

	it( "returns the number of characters for the text of a given paper", function() {
		expect( textLength( paper ) ).toEqual( { count: 6, unit: "character" } );
	} );
} );
