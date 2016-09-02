var findKeywordInUrl = require( "../../js/stringProcessing/findKeywordInUrl" );

describe( "findKeywordInUrl", function() {
	it( "returns false when passed no anchor tag", function() {
		expect( findKeywordInUrl( "bogus" ) ).toBe( false );
	});
});
