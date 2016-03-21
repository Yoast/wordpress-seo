var keyphraseLength = require( "../../js/researches/keyphraseLength.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the keyphrase length research", function() {
	it( "should count the words in the input", function() {
		var paper = new Paper( "", { keyword: "word word" } );

		var result = keyphraseLength( paper );

		expect( result ).toBe( 2 );
	})
});