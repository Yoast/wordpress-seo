var stopWordsInKeywordAssessment = require( "../../js/assessments/keywordStopWordsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A stop word in keyword assessment", function() {
	it( "assesses no stop words in the keyword", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			keyword: "sample"
		});

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.hasScore() ).toEqual( false );
		expect( assessment.getText() ).toEqual ( "" );
	} );

	it( "assesses one stop word in the keyword", function() {
		var mockPaper = new Paper( "sample text without stopwords", {
			keyword: "about"
		});

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.hasScore() ).toEqual( true );
		expect( assessment.getText() ).toEqual ( "The focus keyword contains a stop word. This may or may not be wise depending on the circumstances. Read <a href='https://yoast.com/handling-stopwords/' target='new'>this article</a> for more info.");
	} );

	it( "assesses multiple stop words in the keyword", function(){
		var mockPaper = new Paper( "These are just five words", {
			keyword: "about before"
		});

		var assessment = stopWordsInKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ "about", "before" ] ), i18n );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual ( "The focus keyword contains 2 stop words. This may or may not be wise depending on the circumstances. Read <a href='https://yoast.com/handling-stopwords/' target='new'>this article</a> for more info.");
	} );
} );
