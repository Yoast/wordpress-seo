var paragraphTooLongAssessment = require( "../../js/assessments/paragraphTooLongAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too long paragraphs.", function() {
	it( "scores 1 paragraph with ok length", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of your paragraphs are too long, which is great." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 160, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6.42 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 6000, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 71, paragraph: "" }, { wordCount: 83, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of your paragraphs are too long, which is great." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 71, paragraph: "" }, { wordCount: 183, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 5.04 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, paragraph: "" }, { wordCount: 191, paragraph: "" }, { wordCount: 183, paragraph: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 4.56 );
		expect( assessment.getText() ).toBe( "2 of the paragraphs contain more than the recommended maximum of 150 words. Are you sure " +
			"all information within each of these paragraphs is about the same topic, and therefore belongs in a single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
});

