import Sentence from '../../src/values/Sentence.js';

describe( "Creates a sentence object", function() {
	it( "returns an object containing a text", function() {
		var sentence = new Sentence( "This is a sample text" );
		expect( sentence.getSentenceText() ).toBe( "This is a sample text" );
	} );
} );

describe( "Creates an empty sentence object", function() {
	it( "returns an object containing no text", function() {
		var sentence = new Sentence();
		expect( sentence.getSentenceText() ).toBe( "" );
		expect( sentence.getLocale() ).toBe( "en_US" );
	} );
} );
