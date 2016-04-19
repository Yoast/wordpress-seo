var paragraphTooShortAssessment = require( "../../js/assessments/paragraphTooShortAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too short paragraphs.", function() {
	it( "scores 1 paragraph with ok length", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 60 ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of your paragraphs is too short, which is great." );
	} );
	it( "scores 1 slightly too short paragraph", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 37 ] ), i18n );
		expect( assessment.getScore() ).toBe( 6.6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains less than the recommended minimum " +
		"of 40 words. Try to expand this paragraph, or connect it to the previous or next paragraph." );
	} );
	it( "scores 1 extremely short paragraph", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 1 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains less than the recommended minimum " +
		"of 40 words. Try to expand this paragraph, or connect it to the previous or next paragraph.");
	} );
	it( "scores 3 paragraphs with ok length", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 60, 71, 83 ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of your paragraphs is too short, which is great." );
	} );
	it( "scores 3 paragraphs, one of which is too short", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 60, 33, 183 ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains less than the recommended minimum " +
			"of 40 words. Try to expand this paragraph, or connect it to the previous or next paragraph." );
	} );
	it( "scores 3 paragraphs, two of which are too short", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ 60, 33, 21 ] ), i18n );
		expect( assessment.getScore() ).toBe( 4.2 );
		expect( assessment.getText() ).toBe( "2 of the paragraphs contain less than the recommended minimum of 40 words.  Try to expand" +
			" these paragraphs, or connect each of them to the previous or next paragraph." );
	} );
});

