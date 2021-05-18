import metaDescriptionLength from "../../../src/languageProcessing/researches/metaDescriptionLength.js";
import Paper from "../../../src/values/Paper.js";

describe( "the meta description length research", function() {
	it( "returns the length (25) of the description", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 25 );
	} );

	it( "returns the length (0) of the description", function() {
		const paper = new Paper( "", { keyword: "word", description: "" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 0 );
	} );
} );
