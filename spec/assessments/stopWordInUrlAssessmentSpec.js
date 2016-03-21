var stopWordsInUrlAssessment = require( "../../js/assessments/stopWordsInUrl.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A stop word in url assessment", function() {
	it( "assesses no stop words in the url", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			url: "https://www.google.com/"
		});

		var assessment = stopWordsInUrlAssessment( mockPaper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual ( "" );
	} );

	it( "assesses one stop word in the url", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			url: "https://www.google.com/about-stopwords"
		});

		var assessment = stopWordsInUrlAssessment( mockPaper, Factory.buildMockResearcher( [ "about" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual ( "The slug for this page contains a <a href='http://en.wikipedia.org/wiki/Stop_words' target='new'>stop word</a>, consider removing it." );
	} );

	it( "assesses multiple stop words in the url", function(){
		var mockPaper = new Paper( "These are just five words", {
			url: "https://www.google.com/before-about-stopwords"
		});

		var assessment = stopWordsInUrlAssessment( mockPaper, Factory.buildMockResearcher( ["about", "before"] ), i18n );
		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual ( "The slug for this page contains <a href='http://en.wikipedia.org/wiki/Stop_words' target='new'>stop words</a>, consider removing them." );
	} );
} );
