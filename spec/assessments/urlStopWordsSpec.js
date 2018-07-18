var stopWordsInUrlAssessment = require( "../../js/assessments/seo/urlStopWordsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
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
		expect( assessment.getText() ).toEqual( "The slug for this page contains a <a href='http://en.wikipedia.org/wiki/Stop_words' target='_blank'>stop word</a>, consider removing it." );
	} );

	it( "assesses multiple stop words in the url", function() {
		var mockPaper = new Paper( "These are just five words", {
			url: "https://www.google.com/before-about-stopwords",
		} );

		var assessment = stopWordsInUrlAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about", "before" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "The slug for this page contains <a href='http://en.wikipedia.org/wiki/Stop_words' target='_blank'>stop words</a>, consider removing them." );
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
