import stopWordsInKeywordAssessment from "../../src/assessments/seo/keywordStopWordsAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

describe( "A stop word in keyword assessment", function() {
	it( "assesses no stop words in the keyword", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			keyword: "sample",
		} );

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.hasScore() ).toEqual( false );
		expect( assessment.getText() ).toEqual( "" );
	} );

	it( "assesses one stop word in the keyword", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			keyword: "about",
		} );

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.hasScore() ).toEqual( true );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34b' target='_blank'>Stopwords</a>: The keyphrase contains stop words. This may or may not be wise depending on the circumstances. <a href='https://yoa.st/34c' target='_blank'>Learn more about stop words</a>." );
	} );

	it( "assesses multiple stop words in the keyword", function() {
		var mockPaper = new Paper( "These are just five words", {
			keyword: "about before",
		} );

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about", "before" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34b' target='_blank'>Stopwords</a>: The keyphrase contains stop words. This may or may not be wise depending on the circumstances. <a href='https://yoa.st/34c' target='_blank'>Learn more about stop words</a>." );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	it( "returns false for isApplicable for an English paper without keyword.", function() {
		var paper = new Paper( "", { locale: "en_EN" } );
		expect( stopWordsInKeywordAssessment.isApplicable( paper ) ).toBe( false );
	} );
	it( "returns true for isApplicable for an English paper with keyword.", function() {
		var paper = new Paper( "", { locale: "en_EN", keyword: "keyword" } );
		expect( stopWordsInKeywordAssessment.isApplicable( paper ) ).toBe( true );
	} );
	it( "returns false for isApplicable for an Dutch paper without keyword.", function() {
		var paper = new Paper( "", { locale: "nl_NL" } );
		expect( stopWordsInKeywordAssessment.isApplicable( paper ) ).toBe( false );
	} );
	it( "returns false for isApplicable for an Dutch paper with keyword.", function() {
		var paper = new Paper( "", { locale: "nl_NL", keyword: "keyword" } );
		expect( stopWordsInKeywordAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );
