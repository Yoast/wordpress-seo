var sentenceBeginnings = require( "../../js/researches/getSentenceBeginnings.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	it( "returns an object with sentence beginnings and counts for two sentences starting with different words.", function() {
		var mockPaper = new Paper( "How are you? Bye!" );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "How" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "Bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );
	it( "returns an object with sentence beginnings and counts for two sentences starting with the same word.", function() {
		var mockPaper = new Paper( "Hey, hey! Hey." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "Hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );
	it( "returns an object with sentence beginnings and counts for four sentences, the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		var mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "Hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "Bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[2].word ).toBe( "Hey" );
		expect( sentenceBeginnings( mockPaper )[2].count ).toBe( 1 );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with one of the exception words.", function() {
		var mockPaper = new Paper( "The boy, hey! The boy. The boy." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "The boy" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		var mockPaper = new Paper( "One, two, three. One, two, three. One, two, three." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "One two" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );
} );
