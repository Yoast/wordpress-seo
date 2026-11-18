import recommendedKeyphraseCount from "../../../../src/scoring/helpers/assessments/recommendedKeywordCount.js";

const maxRecommendedDensity = 3;
const minRecommendedDensity = 0.5;

describe( "Test for getting the recommended keyphrase count for a text", function() {
	it( "returns the maximum recommended keyphrase count for a text with 300 words and a 1-word keyphrase", function() {
		expect( recommendedKeyphraseCount( 1, maxRecommendedDensity, "max", 300 ) ).toBe( 8 );
	} );

	it( "returns the maximum recommended keyphrase count for a text with 300 words and a 1-word keyphrase, " +
		"using the custom helper for retrieving the words", function() {
		expect( recommendedKeyphraseCount( 1, maxRecommendedDensity, "max", 300 ) ).toBe( 8 );
	} );

	it( "returns the maximum recommended keyphrase count for a text with 300 words and a multi-word keyphrase", function() {
		expect( recommendedKeyphraseCount( 2, maxRecommendedDensity, "max", 300 ) ).toBe( 6 );
	} );

	it( "returns the minimum recommended keyphrase count for a text with 1200 words and a 1-word keyphrase", function() {
		expect( recommendedKeyphraseCount( 1, minRecommendedDensity, "min", 1200 ) ).toBe( 6 );
	} );

	it( "returns 2 as the default recommended minimum keyphrase count if the text is very short", function() {
		expect( recommendedKeyphraseCount( 1, minRecommendedDensity, "min", 3 ) ).toBe( 2 );
	} );

	it( "returns 0 when the word count of the text is 0", function() {
		expect( recommendedKeyphraseCount( 1, maxRecommendedDensity, "max", 0 ) ).toBe( 0 );
	} );

	it( "returns 0 when the paper only contains excluded element", function() {
		expect( recommendedKeyphraseCount( 1, maxRecommendedDensity, "min", 0 ) ).toBe( 0 );
	} );
} );
