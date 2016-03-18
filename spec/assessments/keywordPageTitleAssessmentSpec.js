var pageTitleKeywordAssessment = require( "../../js/assessments/pagetitleKeyword.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "an assessment to check if the keyword is in the pageTitle", function(){
	it( "returns an assementresult with keyword not found", function(){
		var paper = new Paper( "", {
			keyword: "keyword",
			title: "this is a title"
		} );
		var assessment = pageTitleKeywordAssessment( paper, Factory.buildMockResearcher( {matches: 0} ), i18n );

		expect( assessment.score).toBe(2);
	} )
} );