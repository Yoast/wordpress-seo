var linkMatches = require( "../../js/stringProcessing/getAnchorsFromText.js" );

describe("matches links in URL", function(){
	it("returns array with matches", function(){
		expect( linkMatches( "a text without links") ).toEqual([]);
		expect( linkMatches( "a <a href='test.com'>text</a> with a link")[0] ).toBe("<a href='test.com'>text</a>");
	});
});
