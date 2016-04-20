var wordCountAssessment = require( "../../js/assessments/textLengthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A word count assessment", function(){
	it( "assesses a single word", function(){
		var mockPaper = new Paper( "sample" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 1 word. This is far too low and should be increased.' );
	} );

	it( "assesses a low word count", function(){
		var mockPaper = new Paper( "These are just five words" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 5 words. This is far too low and should be increased.' );
	} );

	it( "assesses a medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 150) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 150 ), i18n );

		expect( assessment.getScore() ).toEqual( -10 );
	} );

	it( "assesses a slightly higher than medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 225) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 225 ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
	} );

	it( "assesses an almost at the recommended amount, word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 275) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 275 ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
	} );

	it( "assesses high word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 325) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 325 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );
} );
