var wordComplexityAssessment = require( "../../js/assessments/wordComplexityAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "an assessment returning complex words", function() {
	it( "runs a test with too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ 1, 2, 3, 4, 3, 3, 4, 2, 1, 10 ] ), i18n );
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "30% of the words contain over 4 syllables, which is more than the recommended maximum of 10%" );
	} );

	it( "runs a test with exactly 10% too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ 1, 2, 3, 1, 3, 3, 1, 2, 1, 10 ] ), i18n );
		//floating point bug
		expect( result.getScore() ).toBe( 7.0200000000000005 );
		expect( result.getText() ).toBe( "10% of the words contain over 4 syllables, which is within the recommended range." );
	} );

	it( "runs a test with 0% too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ 1, 2, 3, 1, 3, 3, 1, 2, 1, 1 ] ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "0% of the words contain over 4 syllables, which is within the recommended range." );
	} )

} );
