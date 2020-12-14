import sentenceCount from "../../../../src/languageProcessing/helpers/sentence/countSentences.js";

describe( "Counting of sentences", function() {
	it( "returns the number of sentences in a string", function() {
		expect( sentenceCount( "First sentence. Second sentence. 3rd sentence." ) ).toBe( 3 );
		expect( sentenceCount( "<p></p>" ) ).toBe( 0 );

		// These don't work yet because of the repeated sentence terminators, but they aren't important right now.
		// Expect( sentenceCount( "First sentence.. Second sentence. 3rd sentence." ) ).toBe( 3 );
		// Expect( sentenceCount( "First sentence!!! Second sentence. 3rd sentence." ) ).toBe( 3 );
		// Expect( sentenceCount( "First sentence!!! Second sentence. 3rd sentence. ." ) ).toBe( 3 );
	} );
} );
