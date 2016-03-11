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
		var assessment = linkStatisticAssessment( mockPaper, i18n );

		expect( assessment.getScore() ).toEqual( 2 );
		expect( assessment.getText() ).toEqual ( 'Outbound links appear in this page' );

		mockPaper = new Paper( "a test with a <a href='http://yoast.com' alt='' rel='nofollow'> link </a>", attributes );
		assessment = linkStatisticAssessment( mockPaper, i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual ( 'This page has 1 outbound link(s), all nofollowed.' );
	} );
} );
