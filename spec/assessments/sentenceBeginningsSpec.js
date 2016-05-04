var sentenceBeginningsAssessment = require( "../../js/assessments/sentenceBeginningsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores one instance with 4 consecutive sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "heey", count: 2 }, { word: "heeey", count: 1 },
			{ word: "heeeeey", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "4 consecutive sentences start with the same word. Try to mix things up!" );
	} );

	it( "scores two instance with too many consecutive sentences starting with the same word, 5 being the lowest count.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "heey", count: 6 }, { word: "heeey", count: 1 },
			{ word: "heeeeey", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "Your text contains 2 instances where 5 or more consecutive sentences start with the same word. Try to mix things up!" );
	} );

	it( "scores zero instance with too many consecutive sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 1 }, { word: "heey", count: 2 }, { word: "heeey", count: 2 },
			{ word: "heeeeey", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );

	it( "is not applicable for a paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "" ) );
		expect( assessment ).toBe( false );
	} );
});
