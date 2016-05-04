var sentenceBeginnings = require( "../../js/researches/getSentenceBeginnings.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "gets the sentence beginnings", function() {
	it( "returns an array with sentence beginnings", function() {
		var mockPaper = new Paper( "How are you? Bye!" );
		expect( sentenceBeginnings( mockPaper ) ).toContain( "how" );
		expect( sentenceBeginnings( mockPaper ) ).toContain( "bye" );
	} );
	it( "returns an array with sentence beginnings", function() {
		var mockPaper = new Paper( "Hey, hey! Hey." );
		expect( sentenceBeginnings( mockPaper ) ).toContain( "hey" );
	} );
	it( "returns an array with sentence beginnings", function() {
		var mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey." );
		expect( sentenceBeginnings( mockPaper ) ).toContain( "hey" );
	} );
} );
