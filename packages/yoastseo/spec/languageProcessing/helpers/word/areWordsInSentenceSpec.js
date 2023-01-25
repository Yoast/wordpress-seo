import areWordsInSentence from "../../../../src/languageProcessing/helpers/word/areWordsInSentence.js";

describe( "a test to check if one or more words of a list occur in a sentence", function() {
	it( "returns true if one or more words of a list occur in a sentence", function() {
		expect( areWordsInSentence( [ "tortie", "calico", "tabby", "smoky" ],
			"A tabby is any domestic cat with a distinctive 'M' shaped marking on its forehead" ) ).toBe( true );
	} );

	it( "returns false if none of the words of a list occur in a sentence", function() {
		expect( areWordsInSentence( [ "tortie", "calico", "tabby", "smoky" ],
			"It's a baby cat" ) ).toBe( false );
	} );
} );
