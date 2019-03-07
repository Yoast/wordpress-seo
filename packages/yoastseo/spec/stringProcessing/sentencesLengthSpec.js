import sentencesLength from "../../src/stringProcessing/sentencesLength";

describe( "sentencesLength", function() {
	it( "doesn't return a length for an empty sentence", function() {
		var sentences = [ "", "A sentence" ];

		var lengths = sentencesLength( sentences );

		expect( lengths ).toEqual( [ { sentence: "A sentence", sentenceLength: 2 } ] );
	} );
} );
