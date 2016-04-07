var taxonomyTextLengthAssessment = require( "../../js/assessments/taxonomyTextLengthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A word count assessment", function(){
	it( "assesses a single word", function(){
		var mockPaper = new Paper( "sample" );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 1 word, this is far too low and should be increased.' );
	} );

	it( "assesses a low word count", function(){
		var mockPaper = new Paper( "These are just five words" );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 5 words, this is far too low and should be increased.' );
	} );

	it( "assesses a medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 90) );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 90 ), i18n );

		expect( assessment.getScore() ).toEqual( -10 );
	} );

	it( "assesses a slightly higher than medium word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 110) );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 110 ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
	} );

	it( "assesses an almost at the recommended amount, word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 130) );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 130 ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
	} );

	it( "assesses high word count", function(){
		var mockPaper = new Paper( Factory.buildMockString("Sample ", 175) );
		var assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 175 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );
} );
