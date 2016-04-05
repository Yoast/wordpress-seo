var linkCount = require( "../../js/researches/countLinks.js" );
var Paper = require( "../../js/values/Paper.js" );
var foundLinks;

describe("Tests a string for anchors", function() {
	it("returns an object with all linktypes found", function () {
		var mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>" );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toBe( 1 );

		mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>" );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toBe( 2 );

		mockPaper = new Paper( "string" );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toBe( 0 );
	});
});
