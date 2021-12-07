import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";
import paragraphLengthJapanese from "../../../../src/languageProcessing/languages/ja/config/paragraphLength";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

const paragraphTooLongAssessment = new ParagraphTooLongAssessment();
const shortTextJapanese = "は".repeat( 100 );
const longTextJapanese = "は".repeat( 160 );
const veryLongTextJapanese = "は".repeat( 300 );

describe( "An assessment for scoring too long paragraphs.", function() {
	const paper = new Paper();
	it( "scores 1 paragraph with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 160, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 6000, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 83, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 191, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns an empty assessment result for a paper without paragraphs.", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ) );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
} );

describe( "Counts words instead of characters in Japanese", function() {
	it( "Scores 1 slightly too long paragraph", function() {
		const paper = new Paper( longTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "Scores 1 too long paragraph", function() {
		const paper = new Paper( veryLongTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "Scores 2 slightly too long paragraphs", function() {
		const paper = new Paper( shortTextJapanese + "<p>" + longTextJapanese + "</p><p>" + longTextJapanese + "</p>"  );
		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 150 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "Applicability of the assessment.", function() {
	it( "returns true for isApplicable on a paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( true );
	} );
	it( "returns false for isApplicable on a paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { countLength: 210, text: "This is a very interesting paper." } ] );
		const expected = [
			new Mark( { original: "This is a very interesting paper.", marked: "<yoastmark class='yoast-text-mark'>This is" +
					" a very interesting paper.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { countLength: 60, text: "" }, { countLength: 11, text: "" },
			{ countLength: 13, text: "" } ] );
		const expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );

describe( "test for paragraph too long assessment when is used in product page analysis", function() {
	it( "assesses a paper from product page with paragraphs that contain less than 70 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 60, text: "" },
			{ countLength: 11, text: "" },
			{ countLength: 13, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
			"None of the paragraphs are too long. Great job!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain more than 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 110, text: "" },
			{ countLength: 150, text: "" },
			{ countLength: 150, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain" +
			" more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain between 70 and 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 90, text: "" },
			{ countLength: 75, text: "" },
			{ countLength: 80, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
			"more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
} );

describe( "test for paragraph too long assessment for languages that have language-specific config", () => {
	// Japanese has a language specific config for paragraph length. The config is used for the unit tests below.
	describe( "test for non-product pages", () => {
		it( "assesses a paper with paragraphs that contain less than 300 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 200, text: "" },
				{ countLength: 260, text: "" },
				{ countLength: 100, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "assesses a paper with two paragraphs that contain more than 400 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "assesses a paper with paragraphs that contain 300-400 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 350, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 390, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
	describe( "test for product pages", () => {
		it( "assesses a paper with paragraphs that contain less than 140 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 100, text: "" },
				{ countLength: 120, text: "" },
				{ countLength: 90, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "assesses a paper with three paragraphs that contain more than 200 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "assesses a paper with all paragraphs that contain 140-200 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 150, text: "" },
				{ countLength: 170, text: "" },
				{ countLength: 200, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
} );

