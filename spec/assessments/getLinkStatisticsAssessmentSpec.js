var linkStatisticAssessment = require( "../../js/assessments/getLinkStatistics.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessor running the linkStatistics", function(){
	it( "Accepts a paper and i18nobject  ", function(){
		var attributes = {
			keyword: "keyword",
			url: "http://example.com"
		};
		var mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt=''>keyword link </a>"  );

		var mockResult = {externalDofollow: 1,
			externalNofollow: 0,
			externalTotal: 1,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal:0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 1};

		var assessment = linkStatisticAssessment.getResult( mockPaper, Factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 2 );
		expect( assessment.getText() ).toEqual ( 'Outbound links appear in this page' );

		mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );

		var mockResult = {externalDofollow: 0,
			externalNofollow: 1,
			externalTotal: 1,
			internalDofollow: 0,
			internalNofollow: 0,
			internalTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
			otherTotal:0,
			total: 1,
			totalKeyword: 0,
			totalNaKeyword: 0};

		assessment = linkStatisticAssessment.getResult( mockPaper, Factory.buildMockResearcher( mockResult ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual ( 'This page has 1 outbound link(s), all nofollowed.' );
	} );
} );
