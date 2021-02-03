import getSentences from "../../../src/languageProcessing/researches/countSentencesFromDescription.js";
import Paper from "../../../src/values/Paper";

describe( "counts words in sentences from text", function() {
	it( "counts the length of sentences with question mark", function() {
		const paper = new Paper( "", { description: "Hello. How are you? Bye" }  );
		expect( getSentences( paper )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper )[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "counts the length of sentences with exclamation mark", function() {
		const paper = new Paper( "", { description: "Hello. How are you! Bye" }  );
		expect( getSentences( paper )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper )[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "counts the length of sentences with many spaces", function() {
		const paper = new Paper( "", { description: "Hello.        How are you? Bye" }  );
		expect( getSentences( paper )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper )[ 2 ].sentenceLength ).toBe( 1 );
	} );
} );
