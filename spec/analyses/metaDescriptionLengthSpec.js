var metaDescriptionLength = require("../../js/analyses/metaDescriptionLength.js");

describe("test for the length of meta", function(){
	it("returns integer with length", function(){
		expect( metaDescriptionLength( "this is a meta" ) ).toBe( 14 );
		expect( metaDescriptionLength( "" ) ).toBe( 0 );
	});
});
