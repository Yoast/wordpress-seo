var metaDescriptionLength = require( "../../js/researches/metaDescriptionLength.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the metadescription length research", function() {
	it( "returns the length (25) of the description", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		var result = metaDescriptionLength( paper );
		expect( result ).toBe( 25 );
	});

	it( "returns the length (0) of the description", function() {
		var paper = new Paper( "", { keyword: "word", description: "" } );
		var result = metaDescriptionLength( paper );
		expect( result ).toBe( 0 );
	});

});