var normalizeSingleQuotes = require( "../../js/stringProcessing/quotes" ).normalizeSingle;

describe( "a quote helper", function() {

	describe( "normalizeSingle", function() {
		it( "should normalize quotes", function() {
			expect( normalizeSingleQuotes( "'" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "‘" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "’" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "‛" ) ).toBe( "'" );
		});
	});
});
