var checkForTooLongSentences = require( "../../js/assessmentHelpers/checkForTooLongSentences.js" );

describe( "Checks if sentences are too long", function() {
	it( "Returns no sentences, none are too long", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
			];
		var wordCount = 256;
		expect( checkForTooLongSentences( sentences, wordCount ) ).toEqual( [ ] );
	} );
	it( "Returns all sentences, all are too long", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
			];
		var wordCount = 16;
		expect( checkForTooLongSentences( sentences, wordCount ) ).toEqual( sentences );
	} );
	it( "Returns 2 out of 4 sentences", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
				{ sentence: "", sentenceLength: 256 },
			];
		var wordCount = 96;
		var expectedOutput =
			[
				{ sentence: "", sentenceLength: 128 },
				{ sentence: "", sentenceLength: 256 },
			];
		expect( checkForTooLongSentences( sentences, wordCount ) ).toEqual( expectedOutput );
	} );
	it( "Returns no sentences, since they are the exact allowed length.", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 64 },
			];
		var wordCount = 64;
		expect( checkForTooLongSentences( sentences, wordCount ) ).toEqual( [ ] );
	} );
} );
