import ListAssessment from "../../../../src/scoring/assessments/readability/ListAssessment";
import Paper from "../../../../src/values/Paper.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import buildTree from "../../../specHelpers/parse/buildTree";

const listAssessment = new ListAssessment();

describe( "a test for an assessment that checks whether a paper contains a list or not", function() {
	it( "assesses when there are no lists", function() {
		const mockPaper = new Paper( "text with no list" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"No lists appear on this page. <a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!" );
	} );
	it( "assesses when there is a list inside an element we want to exclude from the analysis", function() {
		const mockPaper = new Paper( "<blockquote>These are the most important things in life:\n" +
			"<ul>\n" +
			" \t<li>cats</li>\n" +
			" \t<li>kittens</li>\n" +
			"</ul>\n" +
			"</blockquote>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"No lists appear on this page. <a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!" );
	} );
	it( "assesses when there is an ordered list", function() {
		const mockPaper = new Paper( "text with a list <ol type=\"i\">\n" +
			"  <li>Coffee</li>\n" +
			"  <li>Tea</li>\n" +
			"  <li>Milk</li>\n" +
			"</ol>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"There is at least one list on this page. Great!" );
	} );
	it( "assesses when there is an unordered list", function() {
		const mockPaper = new Paper( "This is a text with a list <ul style=\"list-style-type:disc\">\n" +
			"  <li>Coffee</li>\n" +
			"  <li>Tea</li>\n" +
			"  <li>Milk</li>\n" +
			"</ul> and more text after the list" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"There is at least one list on this page. Great!" );
	} );
	it( "should exclude empty list: it has <li> items but they don't have any text", function() {
		const mockPaper = new Paper( "This is a text with a list <ul style=\"list-style-type:disc\">\n" +
			"  <li></li>\n" +
			"</ul> and more text after the list" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: No lists appear on this page. <a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!" );
	} );
	it( "should not exclude a list if at least one of the <li> items has text", function() {
		const mockPaper = new Paper( "This is a text with a list <ul style=\"list-style-type:disc\">\n" +
			"  <li></li>\n" +
			"  <li>test</li>\n" +
			"</ul> and more text after the list" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = listAssessment.getResult( mockPaper );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"There is at least one list on this page. Great!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( listAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword containing a minimum of fifty characters.", {
			slug: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( listAssessment.isApplicable( paper ) ).toBe( true );
	} );

	it( "returns false if the text is too short", function() {
		const paper = new Paper( "hallo" );
		expect( listAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );

describe( "a test for retrieving the feedback texts", () => {
	it( "should return the custom feedback texts when `callbacks.getResultTexts` is provided", () => {
		const assessment = new ListAssessment( {
			callbacks: {
				getResultTexts: () => ( {
					good: "This text has a list.",
					bad: "This text doesn't have a list.",
				} ),
			},
		} );
		expect( assessment.getFeedbackStrings() ).toEqual( {
			good: "This text has a list.",
			bad: "This text doesn't have a list.",
		} );
	} );
} );
