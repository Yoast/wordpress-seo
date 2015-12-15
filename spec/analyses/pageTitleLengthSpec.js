var pageTitleLength = require( "../../js/analyses/getPageTitleLength.js" );

describe("A function to check the length of pageTitle", function(){
	it("returns the length", function(){
		expect( pageTitleLength( "this is a title" ) ).toBe( 15 );
	});
});
