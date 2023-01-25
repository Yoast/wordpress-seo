import wordCountInText from "../../../src/languageProcessing/researches/wordCountInText";
import Paper from "../../../src/values/Paper";

describe( "a test for counting the words in the text", function() {
	it( "returns the count of words in the text", function() {
		const paper = new Paper( "Tell me a story on how to love your cats", { keyword: "how to love your cats" } );
		expect( wordCountInText( paper ).count ).toBe( 10 );
	} );
} );
