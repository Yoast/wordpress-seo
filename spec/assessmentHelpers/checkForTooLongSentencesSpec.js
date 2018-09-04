var checkForTooLongSentences = require( "../../src/assessmentHelpers/checkForTooLongSentences.js" );

describe( "Checks if sentences are too long", function() {
	it( "Returns no sentences, none are too long", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
			];
		var recommendedValue = 256;
		expect( checkForTooLongSentences( sentences, recommendedValue ) ).toEqual( [ ] );
	} );
	it( "Returns all sentences, all are too long", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
			];
		var recommendedValue = 16;
		expect( checkForTooLongSentences( sentences, recommendedValue ) ).toEqual( sentences );
	} );
	it( "Returns 2 sentences that exceed the recommended value", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 32 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 128 },
				{ sentence: "", sentenceLength: 256 },
			];
		var recommendedValue = 96;
		var expectedOutput =
			[
				{ sentence: "", sentenceLength: 128 },
				{ sentence: "", sentenceLength: 256 },
			];
		expect( checkForTooLongSentences( sentences, recommendedValue ) ).toEqual( expectedOutput );
	} );
	it( "Returns no sentences, since they are the exact allowed length.", function() {
		var sentences =
			[
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 64 },
				{ sentence: "", sentenceLength: 64 },
			];
		var recommendedValue = 64;
		expect( checkForTooLongSentences( sentences, recommendedValue ) ).toEqual( [ ] );
	} );
} );
