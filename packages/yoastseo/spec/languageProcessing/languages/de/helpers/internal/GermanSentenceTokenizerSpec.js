import GermanSentenceTokenizer from "../../../../../../src/languageProcessing/languages/de/helpers/internal/SentenceTokenizer";


const sentenceTokenizer = new GermanSentenceTokenizer();

describe( "Test German extension to sentence tokenizer", () =>{
	it( "Correctly tokenizes a sentence with a german ordinal.", () =>{
		const tokens = [
			{ type: "sentence", src: "In den 66" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " Club der Stadt wird nachts getanzt" },
			{ type: "full-stop", src: "." },

		];
		expect( sentenceTokenizer.getSentencesFromTokens( tokens )[ 0 ] ).toBe( "In den 66. Club der Stadt wird nachts getanzt." );
	} );

	it( "Recognizes when a full-stop is part of a German ordinal with 1 digits.", () =>{
		const currentSentence = "In den 1.";
		expect( sentenceTokenizer.endsWithOrdinalDot( currentSentence ) ).toBe( true );
	} );

	it( "Recognizes when a full-stop is part of a German ordinal with 2 digits.", () =>{
		const currentSentence = "In den 12.";
		expect( sentenceTokenizer.endsWithOrdinalDot( currentSentence ) ).toBe( true );
	} );

	it( "Recognizes when a full-stop is part of a German ordinal with 3 digits.", () =>{
		const currentSentence = "In den 123.";
		expect( sentenceTokenizer.endsWithOrdinalDot( currentSentence ) ).toBe( true );
	} );

	xit( "Does not recognize when a full-stop is part of a German ordinal with 4 digits (or more). This is by design.", () =>{
		const currentSentence = "In den 1234.";
		expect( sentenceTokenizer.endsWithOrdinalDot( currentSentence ) ).toBe( true );
	} );

	it( "Recognizes when a full-stop is NOT part of a german ordinal.", () =>{
		const currentSentence = "In den 12. Club der Stadt wird nachts getanzt.";
		expect( sentenceTokenizer.endsWithOrdinalDot( currentSentence ) ).toBe( false );
	} );
} );
