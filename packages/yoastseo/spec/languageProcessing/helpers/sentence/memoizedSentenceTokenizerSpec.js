import memoizedSentenceTokenizer from "../../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";

const blockWithSpaces = "<p> Hello, world. Goodbye, world. </p>";

describe( "A test for the memoized sentence tokenizer", function() {
	it( "Returns an array of sentences from an HTML block", function() {
		const block = "<p>Hello, world. Goodbye, world.</p>";
		expect( memoizedSentenceTokenizer( block ) ).toEqual( [ "Hello, world.", "Goodbye, world." ] );
	} );
	it( "Trims spaces from the beginning and end of the sentences", function() {
		expect( memoizedSentenceTokenizer( blockWithSpaces ) ).toEqual( [ "Hello, world.", "Goodbye, world." ] );
	} );
	it( "Does not trim spaces if the tokenizer is called on the same block as previously," +
		" but with the trimSentences flag set to 'false'", function() {
		expect( memoizedSentenceTokenizer( blockWithSpaces, false ) ).toEqual( [ " Hello, world.", " Goodbye, world. " ] );
	} );
	it( "Trims spaces again", function() {
		expect( memoizedSentenceTokenizer( blockWithSpaces, true ) ).toEqual( [ "Hello, world.", "Goodbye, world." ] );
	} );
} );
