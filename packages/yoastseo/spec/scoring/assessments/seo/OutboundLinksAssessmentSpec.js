import OutboundLinksAssessment from "../../../../src/scoring/assessments/seo/OutboundLinksAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
const linkStatisticAssessment = new OutboundLinksAssessment();

const attributes = {
	keyword: "keyword",
	slug: "example-slug",
};

describe( "Tests outbound links assessment", function() {
	it( "Returns the right result when there are only do-follow outbound links", function() {
		const mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		const mockResult = { externalDofollow: 1,
			externalNofollow: 0,
			externalTotal: 1,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 0 };

		const assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!" );
	} );

	it( "Tests a paper with some do-follow outbound links and some no-follow outbound links", function() {
		const mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		const mockResult = { externalDofollow: 1,
			externalNofollow: 1,
			externalTotal: 2,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 2,
			totalKeyword: 0,
			totalNaKeyword: 1 };

		const assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ) );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: " +
			"There are both nofollowed and normal outbound links on this page. Good job!" );
	} );

	it( "Tests a paper with some no-follow outbound links and no do-follow outbound links", function() {
		const mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );

		const mockResult = { externalDofollow: 0,
			externalNofollow: 1,
			externalTotal: 1,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 0 };

		const assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ) );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: " +
			"All outbound links on this page are nofollowed. <a href='https://yoa.st/34g' target='_blank'>Add some normal links</a>." );
	} );

	it( "Returns the right result when the do-follow outbound links are more than the external links -" +
		"not a real-world scenario, but needed for 100% coverage", function() {
		const mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		const mockResult = { externalDofollow: 3,
			externalNofollow: 1,
			externalTotal: 2,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 0 };

		const assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ) );

		expect( assessment.getScore() ).toEqual( 0 );
	} );

	it( "Tests a paper without outbound links", function() {
		const mockPaper = new Paper( "" );
		let assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( { externalTotal: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: " +
			"No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!" );

		assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( {} ) );
		expect( assessment.getScore() ).toEqual( 0 );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( linkStatisticAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( linkStatisticAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );
