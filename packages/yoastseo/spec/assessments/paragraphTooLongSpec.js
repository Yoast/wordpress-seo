import paragraphTooLongAssessment from "../../src/languages/legacy/assessments/readability/paragraphTooLongAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

describe( "An assessment for scoring too long paragraphs.", function() {
	const paper = new Paper();
	it( "scores 1 paragraph with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 160, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 6000, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 71, text: "" }, { wordCount: 83, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 71, text: "" }, { wordCount: 183, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 191, text: "" }, { wordCount: 183, text: "" } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns an empty assessment result for a paper without paragraphs.", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ), i18n );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
} );

describe( "Applicability of the assessment.", function() {
	it( "returns true for isApplicable on a paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_EN" } );
		paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 5, text: "This is a very interesting paper." } ] ), i18n );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( true );
	} );
	it( "returns false for isApplicable on a paper without text.", function() {
		const paper = new Paper( "", { locale: "fr_FR" } );
		paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 0, text: "" } ] ), i18n );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 210, text: "This is a very interesting paper." } ] );
		const expected = [
			new Mark( { original: "This is a very interesting paper.", marked: "<yoastmark class='yoast-text-mark'>This is a very interesting paper.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 11, text: "" }, { wordCount: 13, text: "" } ] );
		const expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );
