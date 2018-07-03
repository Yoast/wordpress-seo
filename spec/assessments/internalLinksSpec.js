var linkStatisticAssessment = require( "../../js/assessments/seo/internalLinksAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessor running the linkStatistics for internal links", function() {
	it( "Accepts a paper and i18nobject  ", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://yoast.com",
		};
		var mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		var mockResult = { externalDofollow: 0,
			externalNofollow: 0,
			externalTotal: 0,
			internalDofollow: 1,
			internalNofollow: 0,
			internalTotal: 1,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 1 };

		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "This page has 0 nofollowed <a href='https://yoa.st/2pm' target='_blank'>internal link(s)</a> and 1 normal internal link(s)." );

		mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );

		var mockResult = { externalDofollow: 0,
			externalNofollow: 0,
			externalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 1,
			internalTotal: 1,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal: 0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 0 };

		assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "This page has 1 <a href='https://yoa.st/2pm' target='_blank'>internal link(s)</a>, all nofollowed." );
	} );

	it( "Accepts a paper and i18nobject  ", function() {
		var mockPaper = new Paper( "" );
		var assessment = linkStatisticAssessment.getResult( mockPaper, factory.buildMockResearcher( { internalTotal: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "No <a href='https://yoa.st/2pm' target='_blank'>internal links</a> appear in this page, consider adding some as appropriate." );
	} );
} );
