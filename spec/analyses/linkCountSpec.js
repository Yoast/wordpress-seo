var linkCount = require( "../../js/analyses/getLinkStatistics.js" );
var foundLinks;

describe("Tests a string for anchors and analyzes these", function(){
	it("returns an object with all linktypes found", function(){
		foundLinks = linkCount( "string <a href='http://yoast.com'>link</a>", "test", "http://yoast.com");
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 0 );
		expect( foundLinks.totalKeyword ).toBe( 0 );

		foundLinks = linkCount( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", "link", "http://yoast.com");
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
		expect( foundLinks.totalKeyword ).toBe( 2 );

		foundLinks = linkCount( "string <a href='ftp://yoast.com'>link</a>, <a href='http://example.com' rel='nofollow'>link</a>", "link", "http://yoast.com");
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.otherTotal ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
	});
});
