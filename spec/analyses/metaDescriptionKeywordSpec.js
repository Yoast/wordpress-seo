var metaDescriptionKeyword = require( "../../js/analyses/getMetaDescriptionKeyword.js" );

describe("Checks the metadescription for the keyword", function(){
	it("returns the matches", function(){
		expect( metaDescriptionKeyword( "this is a meta", "keyword" ) ).toBe( 0) ;
		expect( metaDescriptionKeyword( "this is a meta with keyword", "keyword" ) ).toBe( 1 );
		expect( metaDescriptionKeyword( "", "keyword" ) ).toBe( -1 );
	});
});