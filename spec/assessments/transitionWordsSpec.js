var transitionWordsAssessment = require( "../../js/assessments/transitionWordsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for transition word percentage", function(){
	it( "returns the score for 25.0% sentences with transition words", function(){
		var mockPaper = new Paper();
		var assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "25% of the sentences contain a transition word or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 33.3% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "33.3% of the sentences contain a transition word or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 16.7% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 6,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual ( "16.7% of the sentences contain a transition word or phrase, " +
			"which is less than the recommended minimum of 20%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 27.8% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 18,
			transitionWordSentences: 5 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "27.8% of the sentences contain a transition word or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 90% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
				transitionWordSentences: 9 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "90% of the sentences contain a transition word or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "is not applicable for empty papers", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );
} );
