import paragraphTooLongAssessment from "../../src/assessments/readability/paragraphTooLongAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../helpers/factory.js";
var i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

var paper = new Paper();
describe( "An assessment for scoring too long paragraphs.", function() {
	it( "scores 1 paragraph with ok length", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of the paragraphs are too long, which is great." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 160, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 6000, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 71, text: "" }, { wordCount: 83, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "None of the paragraphs are too long, which is great." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 71, text: "" }, { wordCount: 183, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "1 of the paragraphs contains more than the recommended maximum of 150 words. " +
			"Are you sure all information is about the same topic, and therefore belongs in one single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 191, text: "" }, { wordCount: 183, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "2 of the paragraphs contain more than the recommended maximum of 150 words. Are you sure " +
			"all information within each of these paragraphs is about the same topic, and therefore belongs in a single paragraph?" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns an empty assessment result for a paper without paragraphs.", function() {
		var assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ), i18n );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
	it( "returns true for isApplicable on a paper with text.", function() {
		var paper = new Paper( "This is a very interesting paper.", { locale: "en_EN" } );
		paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 5, text: "This is a very interesting paper." } ] ), i18n );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		paper = new Paper( "This is a very interesting paper." );
		var paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 210, text: "This is a very interesting paper." } ] );
		var expected = [
			new Mark( { original: "This is a very interesting paper.", marked: "<yoastmark class='yoast-text-mark'>This is a very interesting paper.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		var paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 11, text: "" }, { wordCount: 13, text: "" } ] );
		var expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );
