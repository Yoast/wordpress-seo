import sentencesLength from "../../../../src/languageProcessing/helpers/sentence/sentencesLength";

describe( "A test to count the sentence length.", function() {
	it( "doesn't return a length for an empty sentence", function() {
		const sentences = [ "", "A sentence" ];

		const lengths = sentencesLength( sentences );

		expect( lengths ).toEqual( [ { sentence: "A sentence", sentenceLength: 2 } ] );
	} );

	it( "returns the string and the length of each sentence (the HTML tags should be stripped if present)", function() {
		const sentences = [ "A good text", "this is a <span>textstring</span>" ];

		const lengths = sentencesLength( sentences );

		expect( lengths ).toEqual( [ { sentence: "A good text", sentenceLength: 3 }, { sentence: "this is a textstring", sentenceLength: 4 } ] );
	} );
} );
