import TextAlignmentAssessment from "../../../../src/scoring/assessments/readability/TextAlignmentAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";

const textAlignmentAssessment = new TextAlignmentAssessment();
const mockPaper = new Paper( "This is a paragraph with a bit more than fifty characters." );
const mockPaperRTL = new Paper( "This is a paragraph with a bit more than fifty characters.", { isRTL: true } );

describe( "tests assessment results in LTR languages.", function() {
	it( "returns a bad score when there is a paragraph of center-aligned text in an LTR language", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ { text: "This is a paragraph" +
				" with a bit more than fifty characters.", typeOfBlock: "paragraph" } ] ) );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text has a long block of " +
			"center-aligned text. We recommend changing that to left-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "returns a bad score when there is a heading of center-aligned text in an LTR language", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [ { text: "This is a heading" +
				" with a bit more than fifty characters.", typeOfBlock: "heading" } ] ) );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text has a long block of " +
			"center-aligned text. We recommend changing that to left-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "returns a bad score when there are multiple paragraphs of center-aligned text in an LTR language", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" },
			{ text: "This is another paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" } ] ) );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text contains multiple long" +
			" blocks of center-aligned text. We recommend changing that to left-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "returns a bad score when there are multiple headings of center-aligned text in an LTR language", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
			{ text: "This is another heading with a bit more than fifty characters.", typeOfBlock: "heading" } ] ) );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text contains multiple long" +
			" blocks of center-aligned text. We recommend changing that to left-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "returns a bad score when there is both a paragraph and a heading with center-aligned text in an LTR language", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" } ] ) );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text contains multiple long" +
			" blocks of center-aligned text. We recommend changing that to left-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "returns no score when there are no blocks of center-aligned text", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaper, Factory.buildMockResearcher( [] ) );

		expect( assessmentResult.hasScore() ).toBe( false );
	} );
} );
describe( "returns the correct feedback strings for an RTL language.", function() {
	it( "recommends right-alignment instead of left-alignment for RTL languages when one block of center-aligned text is detected", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, Factory.buildMockResearcher( [ { text: "This is a paragraph" +
				" with a bit more than fifty characters.", typeOfBlock: "paragraph" } ] ) );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text has a long block of " +
			"center-aligned text. We recommend changing that to right-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
	it( "recommends right-alignment for RTL languages when multiple blocks of center-aligned text are detected", function() {
		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, Factory.buildMockResearcher( [
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" } ] ) );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Alignment</a>: Your text contains multiple long" +
			" blocks of center-aligned text. We recommend changing that to right-aligned." );
		expect( assessmentResult.hasMarks() ).toBe( true );
	} );
} );
describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paperWithNoText = new Paper( "" );
		expect( textAlignmentAssessment.isApplicable( paperWithNoText ) ).toBe( false );
	} );
} );
