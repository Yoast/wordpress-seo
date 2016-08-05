var metaDescriptionKeyword = require( "../../js/researches/metaDescriptionKeyword.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the metadescription keyword match research", function() {
	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		var result = metaDescriptionKeyword( paper );
		expect( result ).toBe( 1 );
	});

	it( "returns the number ( 2 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word and a word" } );
		var result = metaDescriptionKeyword( paper );
		expect( result ).toBe( 2 );
	});

	it( "returns the number ( 0 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a bla" } );
		var result = metaDescriptionKeyword( paper );
		expect( result ).toBe( 0 );
	});

	it( "returns -1 because there is no meta", function() {
		var paper = new Paper( "", { keyword: "word", description: "" } );
		var result = metaDescriptionKeyword( paper );
		expect( result ).toBe( -1 );
	});

	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "keywörd", description: "a description with a keyword", locale: "en_US" } );
		var result = metaDescriptionKeyword( paper );
		expect( result ).toBe( 1 );
	});

});
