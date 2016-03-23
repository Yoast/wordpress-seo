var keywordInUrl = require( "../../js/assessments/keywordInUrl.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "A keyword in url count assessment", function(){
	it( "assesses no keyword was found in the url", function() {
		var mockPaper = new Paper( "sample", {
			url: "sample-with-keyword",
			keyword: "kéyword"
		} );

		var assessment = keywordInUrl( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" );
	} );

	it( "assesses a keyword was found in the url", function() {
		var mockPaper = new Paper( "sample", {
			url: "sample-with-keyword",
			keyword: "keyword"
		} );
		var assessment = keywordInUrl( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The focus keyword appears in the URL for this page." );
	} );

} );
