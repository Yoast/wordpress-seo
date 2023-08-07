import recommendedKeyphraseCount from "../../../../src/scoring/helpers/assessments/recommendedKeywordCount.js";
import Paper from "../../../../src/values/Paper";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import japaneseWordHelper from "../../../../src/languageProcessing/languages/ja/helpers/getWords";
import buildTree from "../../../specHelpers/parse/buildTree";
const maxRecommendedDensity = 3;
const minRecommendedDensity = 0.5;

const a = "a ";
const defaultResearcher = new DefaultResearcher();

describe( "Test for getting the recommended keyphrase count for a text", function() {
	it( "returns the maximum recommended keyphrase count for a text with 300 words and a 1-word keyphrase", function() {
		const text = a.repeat( 300 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );
		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity, "max" ) ).toBe( 8 );
	} );

	it( "returns the maximum recommended keyphrase count for a text with 300 words and a 1-word keyphrase, " +
		"using the custom helper for retrieving the words", function() {
		// The sentence contains 10 words.
		const text = "計画段階では「東海道新線」と呼ばれ開業て.".repeat( 30 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );
		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity, "max", japaneseWordHelper ) ).toBe( 8 );
	} );

	it( "returns the maximum recommended keyphrase count for a text with 300 words and a multi-word keyphrase", function() {
		const text = a.repeat( 300 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 2, maxRecommendedDensity, "max" ) ).toBe( 6 );
	} );

	it( "returns the minimum recommended keyphrase count for a text with 1200 words and a 1-word keyphrase", function() {
		const text = a.repeat( 1200 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, minRecommendedDensity, "min" ) ).toBe( 6 );
	} );

	it( "returns 2 as the default recommended minimum keyphrase count if the text is very short", function() {
		const text = a.repeat( 3 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, minRecommendedDensity, "min" ) ).toBe( 2 );
	} );

	it( "returns 0 when the word count of the text is 0", function() {
		const text = "<img src='http://image.com/image.png'>";
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity, "max" ) ).toBe( 0 );
	} );

	it( "returns the maximum recommended keyphrase count when the maxOrMin variable is not explicitly defined", function() {
		const text = a.repeat( 300 );
		const paper = new Paper( "<p>" + text + "</p>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity ) ).toBe( 8 );
	} );

	it( "returns 0 when the paper is empty", function() {
		const paper = new Paper( "" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity ) ).toBe( 0 );
	} );

	it( "returns 0 when the paper only contains excluded element", function() {
		const paper = new Paper( "<blockquote>In ancient Egyptian mythology, cats were highly revered and considered sacred animals.</blockquote>" );
		buildTree( paper, defaultResearcher );

		expect( recommendedKeyphraseCount( paper, 1, maxRecommendedDensity ) ).toBe( 0 );
	} );
} );
