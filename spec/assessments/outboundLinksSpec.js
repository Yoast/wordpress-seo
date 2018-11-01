import OutboundLinksAssessment from "../../src/assessments/seo/OutboundLinksAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

const linkStatisticAssessment = new OutboundLinksAssessment();

describe( "An assessor running the linkStatistics", function() {
	var attributes = {
		keyword: "keyword",
		url: "http://example.com",
	};

	it( "Tests a paper with some do-follow outbound links and no no-follow outbound links", function() {
		var mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		var mockResult = { externalDofollow: 1,
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
			totalNaKeyword: 1 };

		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!" );
	} );

	it( "Tests a paper with some no-folow outbound links and no do-follow outbound links", function() {
		const mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );

		var mockResult = { externalDofollow: 0,
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

		const assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: All outbound links on this page are nofollowed. <a href='https://yoa.st/34g' target='_blank'>Add some normal links</a>." );
	} );

	it( "Returns the right result when there are normal as well as nofollowed outbound links", function() {
		var mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		var mockResult = { externalDofollow: 1,
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
			totalNaKeyword: 2 };

		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: There are both nofollowed and normal outbound links on this page. Good job!" );
	} );

	it( "Tests a paper without outbound links", function() {
		var mockPaper = new Paper( "" );
		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( { externalTotal: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!" );
	} );
} );
