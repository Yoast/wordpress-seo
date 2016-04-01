var matchKeywordAssessment = require( "../../js/assessments/matchKeywordInSubheading.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for matching keywords in subheadings", function(){
	it( "assesses a string without subheadings", function(){
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 0 } ), i18n );

		expect( assessment.hasScore()).toBe( false );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual ( "" );
	} );
	it( "assesses a string with subheadings without keywords", function(){
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "You have not used your focus keyword in any subheading (such as an H2) in your copy." );
	} );
	it( "assesses a string with subheadings and keywords", function(){
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The focus keyword appears in 1 (out of 1) subheadings in the copy. While not a major ranking factor, this is beneficial." );
	} );
	it( "assesses a string with subheadings and keywords", function(){
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 10, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The focus keyword appears in 1 (out of 10) subheadings in the copy. While not a major ranking factor, this is beneficial." );
	} );
} );

