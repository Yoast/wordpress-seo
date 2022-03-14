import removePunctuation from "../../../../src/languageProcessing/helpers/sanitize/removePunctuation.js";

describe( "a test for removing punctuation from a string", function() {
	it( "returns string without dash at the end", function() {
		expect( removePunctuation( "test-" ) ).toBe( "test" );
	} );

	it( "returns string without dash at the beginning", function() {
		expect( removePunctuation( "-test" ) ).toBe( "test" );
	} );

	it( "returns string with punctuation in middle of word untouched", function() {
		expect( removePunctuation( "te-st" ) ).toBe( "te-st" );
	} );

	it( "returns string without punctuation around the word", function() {
		expect( removePunctuation( "'test'" ) ).toBe( "test" );
	} );

	it( "returns string without () around the word", function() {
		expect( removePunctuation( "test)" ) ).toBe( "test" );
	} );
} );

describe( "Removing punctuation at the begin and end of a word", function() {
	it( "returns a word without punctuation.", function() {
		expect( removePunctuation( "word." ) ).toBe( "word" );
		expect( removePunctuation( "10.000" ) ).toBe( "10.000" );
		expect( removePunctuation( "¿que?" ) ).toBe( "que" );
		expect( removePunctuation( "word!!" ) ).toBe( "word" );
		expect( removePunctuation( "¡¡word" ) ).toBe( "word" );
		expect( removePunctuation( "'word'" ) ).toBe( "word" );
		expect( removePunctuation( "'word'!!!???!!!!" ) ).toBe( "word" );
		expect( removePunctuation( "'word–" ) ).toBe( "word" );
		expect( removePunctuation( "'word—" ) ).toBe( "word" );
		expect( removePunctuation( "'word×" ) ).toBe( "word" );
		expect( removePunctuation( "'word+" ) ).toBe( "word" );
		expect( removePunctuation( "'word&" ) ).toBe( "word" );
		expect( removePunctuation( "“word”" ) ).toBe( "word" );
		expect( removePunctuation( "„word‟" ) ).toBe( "word" );
	} );
} );

describe( "Removing language-specific punctuation", function() {
	it( "returns a word without punctuation.", function() {
		// Arabic comma
		expect( removePunctuation( "المقاومة،" ) ).toBe( "المقاومة" );
		// Arabic question mark
		expect( removePunctuation( "الجيدة؟" ) ).toBe( "الجيدة" );
		// Arabic semicolon
		expect( removePunctuation( "الجيدة؛" ) ).toBe( "الجيدة" );
		// Urdu full stop
		expect( removePunctuation( "گئے۔" ) ).toBe( "گئے" );
	} );

	it( "returns a word without punctuation in Japanese.", function() {
		expect( removePunctuation( "高度。" ) ).toBe( "高度" );
		expect( removePunctuation( "⁇" ) ).toBe( "" );
		expect( removePunctuation( "＠東海道" ) ).toBe( "東海道" );
	} );
} );

