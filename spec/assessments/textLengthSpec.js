var wordCountAssessment = require( "../../js/assessments/textLengthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A word count assessment", function(){

	it( "assesses a single word", function(){
		var mockPaper = new Paper( "sample" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 1 word. This is far below the recommended minimum of 300 words. ' +
			'Add more content that is relevant for the topic.' );
	} );

	it( "assesses a low word count", function(){
		var mockPaper = new Paper( "These are just five words" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 5 words. This is far below the recommended minimum of 300 words. ' +
			'Add more content that is relevant for the topic.' );
	} );

	it( "assesses a medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 150) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 150 ), i18n );

		expect( assessment.getScore() ).toEqual( -10 );
		expect( assessment.getText() ).toEqual ( "The text contains 150 words. This is below the recommended minimum of 300 words. " +
			"Add more content that is relevant for the topic." );
	} );

	it( "assesses a slightly higher than medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 225) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 225 ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual ( "The text contains 225 words. This is below the recommended minimum of 300 words. " +
			"Add more content that is relevant for the topic." );
	} );

	it( "assesses an almost at the recommended amount, word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 275) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 275 ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual ( "The text contains 275 words. This is slightly below the recommended minimum of 300 words. " +
			 "Add a bit more copy." );
	} );


	it( "assesses high word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 325) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 325 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The text contains 325 words. This is more than or equal to the recommended minimum of 300 words." );
	} );
} );
