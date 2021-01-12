import wordsInText from "../../../../src/languageProcessing/helpers/word/wordsInText";

describe( "a test for checking a text to see if it contains certain words", function() {
	it( "returns certain words filtered from a text", function() {
		const text = "The mackerel tabby pattern gives slender vertical, gently curving stripes on the sides of the body.";
		expect( wordsInText( text, [ "the", "on", "of", "in", "most", "more" ] ) ).toEqual( [ "the", "on", "of" ] );
	} );
} );

