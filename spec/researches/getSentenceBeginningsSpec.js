var sentenceBeginnings = require( "../../js/researches/getSentenceBeginnings.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	it( "returns an object with sentence beginnings and counts for two sentences starting with different words.", function() {
		var mockPaper = new Paper( "How are you? Bye!" );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "how" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );
	it( "returns an object with sentence beginnings and counts for two sentences starting with the same word.", function() {
		var mockPaper = new Paper( "Hey, hey! Hey." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );
	it( "returns an object with sentence beginnings and counts for four sentences, the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		var mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[2].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[2].count ).toBe( 1 );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with one of the exception words.", function() {
		var mockPaper = new Paper( "The boy, hey! The boy. The boy." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "the boy" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		var mockPaper = new Paper( "One, two, three. One, two, three. One, two, three." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "one two" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings in lists", function() {
		var mockPaper = new Paper( "<ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li></ul>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "item" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 4 );
	});

	it( "returns an object with sentence beginnings in tables", function() {
		var mockPaper = new Paper( "<table><td><tr>Sentence 1.</tr><tr>Sentence 2 that is longer.</tr><tr>Sentence 3 is shorter.</tr><tr>Sentence 4.</tr></td></table>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 4 );
	});

	it( "returns an object with sentence beginnings with paragraph tags - it should match over paragraphs", function() {
		var mockPaper = new Paper( "<p>Sentence 1. Sentence 2.</p><p>Sentence 3.</p>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 3 );
	});

	it( "returns an object with sentence beginnings in different capitalizations", function() {
		var mockPaper = new Paper( "Sentence 1. SENTENCE 2. Sentence 3." );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 3 );
	});

	it( "returns an empty string if only enters or whitespaces in a string", function() {
		var mockPaper = new Paper( "   \n</div>" );
		expect( sentenceBeginnings( mockPaper ) ).toEqual( [] );
	} );
} );
