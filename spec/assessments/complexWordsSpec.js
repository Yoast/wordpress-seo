var wordComplexityAssessment = require( "../../js/assessments/wordComplexityAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "an assessment returning complex words", function() {
	it( "runs a test with too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ word: "", complexity: 1 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 4 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 4 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 10 } ]
		), i18n );
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "30% of the words contain over 3 syllables, which is more than the recommended maximum of 10%." );
	} );

	it( "runs a test with exactly 10% too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ word: "", complexity: 1 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 10 } ]
		), i18n );
		expect( result.getScore() ).toBe( 7.02 );
		expect( result.getText() ).toBe( "10% of the words contain over 3 syllables, which is less than or equal to the recommended maximum of 10%." );
	} );

	it( "runs a test with 0% too many syllables", function(){
		var mockPaper = new Paper( "" );
		var result = wordComplexityAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ word: "", complexity: 1 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 3 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 2 },
			{ word: "", complexity: 1 },
			{ word: "", complexity: 1 } ] ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "0% of the words contain over 3 syllables, which is less than or equal to the recommended maximum of 10%." );
	} )

} );
