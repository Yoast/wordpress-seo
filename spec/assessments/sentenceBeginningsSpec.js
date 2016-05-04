var sentenceBeginningsAssessment = require( "../../js/assessments/sentenceBeginningsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores 3 consecutive sentences starting with the same word.", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 60 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "Three or more consecutive sentences start with the same word. Try to mix things up!" );
	} );
});
