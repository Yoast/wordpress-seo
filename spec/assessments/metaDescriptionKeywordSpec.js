var metaDescriptionKeyword = require( "../../js/assessments/seo/metaDescriptionKeywordAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the metadescription keyword assessment", function() {
	it( "should score a meta with no matching keyword as bad", function() {
		var paper = new Paper( "text", { keyword: "keyword", description: "description" } );
		var researcher = factory.buildMockResearcher( 0 );

		var result = metaDescriptionKeyword.getResult( paper, researcher, i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "A meta description has been specified, but it <a href='https://yoa.st/2pf' target='_blank'>does not contain the focus keyword</a>." );
	} );

	it( "should score a meta with no matching keyword as bad", function() {
		var paper = new Paper( "text", { keyword: "keyword", description: "description" } );
		var researcher = factory.buildMockResearcher( 1 );

		var result = metaDescriptionKeyword.getResult( paper, researcher, i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>." );
	} );

	it( "should not score since there is no meta", function() {
		var paper = new Paper( "text", { keyword: "keyword", description: "" } );
		var researcher = factory.buildMockResearcher( -1 );

		var result = metaDescriptionKeyword.getResult( paper, researcher, i18n );

		expect( result.getText() ).toBe( "" );
	} );
} );

