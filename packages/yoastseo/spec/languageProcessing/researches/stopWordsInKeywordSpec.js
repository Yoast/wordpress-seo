import stopWordsInKeyword from "../../../src/languageProcessing/researches/stopWordsInKeyword";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "a test for finding stopwords in keyword string", function() {
	it( "returns the array of stopwords found in the keyword", function() {
		const paper = new Paper( "Tell me a story on how to love your cats", { keyword: "how to love your cats" } );
		expect( stopWordsInKeyword( paper, new Researcher( paper ) ) ).toEqual(
			[ "to", "how" ]
		);
	} );
} );
