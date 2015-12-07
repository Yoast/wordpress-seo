var linkCount = require( "../../js/analyses/linkCount.js" );
var foundLinks;

describe("Tests a string for anchors and analyzes these", function(){
	it("returns an object with all linktypes found", function(){
		foundLinks = linkCount( "string <a href='http://yoast.com'>link</a>", "test", "http://yoast.com");
		expect( foundLinks[0].result.total ).toBe( 1 );
		expect( foundLinks[0].result.internalTotal ).toBe( 1 );
		expect( foundLinks[0].result.externalTotal ).toBe( 0 );
		expect( foundLinks[0].result.totalKeyword ).toBe( 0 );

		foundLinks = linkCount( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", "link", "http://yoast.com");
		expect( foundLinks[0].result.total ).toBe( 2 );
		expect( foundLinks[0].result.internalTotal ).toBe( 1 );
		expect( foundLinks[0].result.externalTotal ).toBe( 1 );
		expect( foundLinks[0].result.totalKeyword ).toBe( 2 );
	});
});
