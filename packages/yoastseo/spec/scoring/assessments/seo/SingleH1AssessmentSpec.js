import SingleH1Assessment from "../../../../src/scoring/assessments/seo/SingleH1Assessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

const h1Assessment = new SingleH1Assessment();

describe( "An assessment to check whether there is more than one H1 in the text", function() {
	it( "returns the default result when the paper doesn't contain an H1", function() {
		const mockPaper = new Paper( "<p>a paragraph</p>" );
		const assessment = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher( [] ) );

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
		expect( assessment.hasScore() ).toEqual( false );
	} );

	it( "returns the default result when there's an H1 at the beginning of the body", function() {
		const mockPaper = new Paper( "<h1>heading</h1><p>a paragraph</p>" );
		const assessment = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher(
			[ { tag: "h1", content: "heading", position: 0 } ] ) );

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
		expect( assessment.hasScore() ).toEqual( false );
	} );

	it( "returns a bad score and appropriate feedback when there is one superfluous (i.e., non-title) H1s in the body of the text", function() {
		const mockPaper = new Paper( "<p>a paragraph</p><h1>heading</h1>" );
		const assessment = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher(
			[ { tag: "h1", content: "heading", position: 2 } ] ) );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual(  "<a href='https://yoa.st/3a6' target='_blank'>Single title</a>: " +
			"H1s should only be used as your main title. Find all H1s in your text that aren't your main title and " +
			"<a href='https://yoa.st/3a7' target='_blank'>change them to a lower heading level</a>!" );
	} );

	it( "returns a bad score and appropriate feedback when there are multiple one superfluous (i.e., non-title) " +
		"H1s in the body of the text", function() {
		const mockPaper = new Paper( "<p>a paragraph</p><h1>heading 1</h1><p>a paragraph</p><h1>heading 2</h1>" );
		const assessment = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ tag: "h1", content: "heading 1", position: 2 },
			{ tag: "h1", content: "heading 2", position: 4 },
		] ) );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual(  "<a href='https://yoa.st/3a6' target='_blank'>Single title</a>: " +
			"H1s should only be used as your main title. Find all H1s in your text that aren't your main title and " +
			"<a href='https://yoa.st/3a7' target='_blank'>change them to a lower heading level</a>!" );
	} );
} );

describe( "A test for marking incorrect H1s in the body", function() {
	it( "returns markers for incorrect H1s in the body", function() {
		const mockPaper = new Paper( "<p>a paragraph</p><h1>heading</h1>" );
		const assessment = h1Assessment;
		assessment.getResult( mockPaper, Factory.buildMockResearcher( [ { tag: "h1", content: "heading", position: 2 } ] ) );

		const expected = [
			new Mark( { original: "<h1>heading</h1>",
				marked: "<h1><yoastmark class='yoast-text-mark'>heading</yoastmark></h1>" } ),
		];

		expect( assessment.getMarks() ).toEqual( expected );
	} );

	it( "doesn't return markers for H1s in the first position of the body", function() {
		const mockPaper = new Paper( "<h1>heading</h1><p>a paragraph</p>" );
		const results = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher( [ { tag: "h1", content: "heading", position: 0 } ] ) );

		expect( results._hasMarks ).toEqual( false );
		expect( h1Assessment.getMarks() ).toEqual( [] );
	} );

	it( "doesn't return markers when there are no H1s in the body", function() {
		const mockPaper = new Paper( "<p>a paragraph</p>" );
		const results = h1Assessment.getResult( mockPaper, Factory.buildMockResearcher( [] ) );

		expect( results._hasMarks ).toEqual( false );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	it( "is applicable when there is a paper with a text", function() {
		const mockPaper = new Paper( "text" );
		const assessment = h1Assessment.isApplicable( mockPaper );

		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when there there is no text", function() {
		const mockPaper = new Paper( "" );
		const assessment = h1Assessment.isApplicable( mockPaper );

		expect( assessment ).toBe( false );
	} );
} );
