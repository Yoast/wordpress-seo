import ListAssessment from "../../../../src/scoring/assessments/readability/ListAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";

const listAssessment = new ListAssessment();

describe( "A list assessment", function() {
	it( "assesses when there are no lists", function() {
		const mockPaper = new Paper( "text with no list" );

		const assessment = listAssessment.getResult( mockPaper, Factory.buildMockResearcher( false ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: " +
			"No lists appear on this page. <a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!" );
	} );
	it( "assesses when there is a list", function() {
		const mockPaper = new Paper( "text with a list <ol type=\"i\">\n" +
			"  <li>Coffee</li>\n" +
			"  <li>Tea</li>\n" +
			"  <li>Milk</li>\n" +
			"</ol>" );

		const assessment = listAssessment.getResult( mockPaper, Factory.buildMockResearcher( true ) );

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
} );
