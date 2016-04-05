var matchKeywordAssessment = require( "../../js/assessments/textSubheadingsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for matching keywords in subheadings", function(){
	var paper;
	
	beforeEach( function() {
		paper = new Paper();
	});
	
	it( "assesses a string without subheadings", function(){
		var result = matchKeywordAssessment.getResult( paper, Factory.buildMockResearcher( { count: 0 } ), i18n );

		expect( result.getScore() ).toEqual( 7 );
		expect( result.getText() ).toEqual ( "No subheading tags (like an H2) appear in the copy." );
	} );

	it( "assesses a string with subheadings without keywords", function(){
		var result = matchKeywordAssessment.getResult( paper, Factory.buildMockResearcher( { count: 1 } ), i18n );

		expect( result.hasScore() ).toEqual( false );
	} );
} );

