var metaDescriptionLength = require("../../js/analyses/getMetaDescriptionLength.js");

describe("test for the length of meta", function(){
	it("returns integer with length", function(){
		expect( metaDescriptionLength( "this is a meta" ) ).toBe( 14 );
		expect( metaDescriptionLength( "" ) ).toBe( 0 );
	});
});
