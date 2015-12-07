var linkKeywordFunction = require( "../../js/stringProcessing/linkKeyword.js" );

describe( "checks keyword occurences in links", function() {
	it("returns keywords found", function () {
		expect(linkKeywordFunction( "<a href='http://yoast.com'>test</a>", "yoast" ) ).toBe( false );
		expect(linkKeywordFunction( "<a href='http://yoast.com'>yoast</a>", "yoast" ) ).toBe( true );
	});
});

