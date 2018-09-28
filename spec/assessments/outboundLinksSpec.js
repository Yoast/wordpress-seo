import OutboundLinksAssessment from "../../src/assessments/seo/outboundLinksAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

let linkStatisticAssessment = new OutboundLinksAssessment();

describe( "An assessor running the linkStatistics", function() {
	it( "Accepts a paper and i18nobject  ", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.com",
		};
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
		expect( assessment.getText() ).toEqual( "This page has 0 nofollowed <a href='https://yoa.st/2pl' target='_blank'>outbound link(s)</a> and 1 normal outbound link(s)." );

		mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );

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

		assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "This page has 1 <a href='https://yoa.st/2pl' target='_blank'>outbound link(s)</a>, all nofollowed." );
	} );

	it( "Accepts a paper and i18nobject  ", function() {
		var mockPaper = new Paper( "" );
		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( { externalTotal: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "No <a href='https://yoa.st/2pl' target='_blank'>outbound links</a> appear in this page, consider adding some as appropriate." );
	} );
} );
