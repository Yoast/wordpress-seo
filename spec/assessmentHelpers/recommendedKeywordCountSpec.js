import recommendedKeywordCount from "../../src/assessmentHelpers/recommendedKeywordCount.js";
const maxRecommendedDensity = 3;
const minRecommendedDensity = 0.5;

const a = "a ";

describe( "Test for getting the recommended keyword count for a text", function() {
	it( "returns the maximum recommended keyword count for a text with 300 words and a 1-word keyphrase", function() {
		const text = a.repeat( 300 );
		expect( recommendedKeywordCount( text, 1, maxRecommendedDensity, "max" ) ).toBe( 8 );
	} );

	it( "returns the maximum recommended keyword count for a text with 300 words and a multi-word keyphrase", function() {
		const text = a.repeat( 300 );
		expect( recommendedKeywordCount( text, 2, maxRecommendedDensity, "max" ) ).toBe( 6 );
	} );

	it( "returns the minimum recommended keyword count for a text with 1200 words and a 1-word keyphrase", function() {
		const text = a.repeat( 1200 );
		expect( recommendedKeywordCount( text, 1, minRecommendedDensity, "min" ) ).toBe( 6 );
	} );

	it( "returns 2 as the default recommended minimum keyword count if the text is very short", function() {
		const text = a.repeat( 3 );
		expect( recommendedKeywordCount( text, 1, minRecommendedDensity, "min" ) ).toBe( 2 );
	} );

	it( "returns 0 when the word count of the text is 0", function() {
		const text = "<img src='http://image.com/image.png'>";
		expect( recommendedKeywordCount( text, 1, maxRecommendedDensity, "max" ) ).toBe( 0 );
	} );

	it( "returns the maximum recommended keyword count when the maxOrMin variable is not explicitly defined", function() {
		const text = a.repeat( 300 );
		expect( recommendedKeywordCount( text, 1, maxRecommendedDensity ) ).toBe( 8 );
	} );
} );
