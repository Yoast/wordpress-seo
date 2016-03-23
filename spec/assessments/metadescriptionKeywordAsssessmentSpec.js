var metaDescriptionKeyword = require( "../../js/assessments/metaDescriptionKeyword.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the metadescription keyword assessment", function() {
	it( "should score a meta with no matching keyword as bad", function() {
		var paper = new Paper( "text", { keyword: "keyword", description: "description" } );
		var researcher = factory.buildMockResearcher( 0 );

		var result = metaDescriptionKeyword( paper, researcher, i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "A meta description has been specified, but it does not contain the focus keyword." );
	} );

	it( "should score a meta with no matching keyword as bad", function() {
		var paper = new Paper( "text", { keyword: "keyword", description: "description" } );
		var researcher = factory.buildMockResearcher( 1 );

		var result = metaDescriptionKeyword( paper, researcher, i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The meta description contains the focus keyword." );
	} );
} );

