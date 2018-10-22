import stopWordsInUrlAssessment from "../../src/assessments/seo/urlStopWordsAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

describe( "A stop word in url assessment", function() {
	it( "assesses no stop words in the url", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			url: "https://www.google.com/",
		} );

		var assessment = stopWordsInUrlAssessment.getResult( mockPaper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
	} );

	it( "assesses one stop word in the url", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			url: "https://www.google.com/about-stopwords",
		} );

		var assessment = stopWordsInUrlAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!" );
	} );

	it( "assesses multiple stop words in the url", function() {
		var mockPaper = new Paper( "These are just five words", {
			url: "https://www.google.com/before-about-stopwords",
		} );

		var assessment = stopWordsInUrlAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about", "before" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains stop words. <a href='https://yoa.st/34q' target='_blank'>Remove them</a>!" );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	it( "returns true for isApplicable for an English paper", function() {
		var paper = new Paper( "", { locale: "en_EN" } );
		expect( stopWordsInUrlAssessment.isApplicable( paper ) ).toBe( true );
	} );
	it( "returns false for isApplicable for an Dutch paper", function() {
		var paper = new Paper( "", { locale: "nl_NL" } );
		expect( stopWordsInUrlAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );
