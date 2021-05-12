import removePunctuationExceptQuotes from "../../../../src/languageProcessing/helpers/sanitize/removePunctuationExceptQuotes.js";

describe( "a test for removing punctuation from a string", function() {
	it( "returns string without dash at the end", function() {
		expect( removePunctuationExceptQuotes( "test-" ) ).toBe( "test" );
	} );

	it( "returns string without dash at the beginning", function() {
		expect( removePunctuationExceptQuotes( "-test" ) ).toBe( "test" );
	} );

	it( "returns string with punctuation in middle of word untouched", function() {
		expect( removePunctuationExceptQuotes( "te-st" ) ).toBe( "te-st" );
	} );

	it( "returns string without punctuation around the word", function() {
		expect( removePunctuationExceptQuotes( "'test'" ) ).toBe( "test" );
	} );

	it( "returns string without () around the word", function() {
		expect( removePunctuationExceptQuotes( "test)" ) ).toBe( "test" );
	} );
} );

describe( "Removing punctuation at the beginning and end of a word", function() {
	it( "returns a word without punctuation.", function() {
		expect( removePunctuationExceptQuotes( "word." ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "10.000" ) ).toBe( "10.000" );
		expect( removePunctuationExceptQuotes( "¿que?" ) ).toBe( "que" );
		expect( removePunctuationExceptQuotes( "word!!" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "¡¡word" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word'" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word'!!!???!!!!" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word–" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word—" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word×" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word+" ) ).toBe( "word" );
		expect( removePunctuationExceptQuotes( "'word&" ) ).toBe( "word" );
	} );
} );


