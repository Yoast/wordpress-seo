var paragraphTooShortAssessment = require( "../../js/assessments/paragraphTooShortAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too short paragraphs.", function() {
	it( "scores 1 paragraph with ok length", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of the paragraphs are too short, which is great." );
	} );
	it( "scores 1 slightly too short paragraph", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 37, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6.6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs is too short. The recommended minimum is" +
		" 40 words. Try to expand this paragraph, or connect it to the previous or next paragraph." );
	} );
	it( "scores 1 extremely short paragraph", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 1, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs is too short. The recommended minimum is " +
		"40 words. Try to expand this paragraph, or connect it to the previous or next paragraph.");
	} );
	it( "scores 3 paragraphs with ok length", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 71, paragraph: "" }, { wordCount: 83, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of the paragraphs are too short, which is great." );
	} );
	it( "scores 3 paragraphs, one of which is too short", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 33, paragraph: "" }, { wordCount: 183, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs is too short. The recommended minimum" +
			" is 40 words. Try to expand this paragraph, or connect it to the previous or next paragraph." );
	} );
	it( "scores 3 paragraphs, two of which are too short", function() {
		var assessment = paragraphTooShortAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 33, paragraph: "" }, { wordCount: 21, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 4.2 );
		expect( assessment.getText() ).toBe( "2 of the paragraphs are too short. The recommended minimum is 40 words. Try to expand" +
			" these paragraphs, or connect each of them to the previous or next paragraph." );
	} );
});

