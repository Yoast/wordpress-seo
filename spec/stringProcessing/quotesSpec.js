var normalizeSingleQuotes = require( "../../js/stringProcessing/quotes" ).normalizeSingle;
var normalizeDoubleQuotes = require( "../../js/stringProcessing/quotes" ).normalizeDouble;
var normalize = require( "../../js/stringProcessing/quotes" ).normalize;

describe( "a quote helper", function() {

	describe( "normalizeSingle", function() {
		it( "should normalize single quotes", function() {
			expect( normalizeSingleQuotes( "'" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "‘" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "’" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "‛" ) ).toBe( "'" );
			expect( normalizeSingleQuotes( "`" ) ).toBe( "'" );
		});
	});

	describe( "normalizeDouble", function() {
		it( "should normalize double quotes", function() {
			expect( normalizeDoubleQuotes( "“" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "”" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "〝" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "〞" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "〟" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "‟" ) ).toBe( "\"" );
			expect( normalizeDoubleQuotes( "„" ) ).toBe( "\"" );
		});
	});

	describe( "normalize", function() {
		it( "should normalize quotes", function() {
			expect( normalize( "'" ) ).toBe( "'" );
			expect( normalize( "‘" ) ).toBe( "'" );
			expect( normalize( "’" ) ).toBe( "'" );
			expect( normalize( "‛" ) ).toBe( "'" );
			expect( normalize( "`" ) ).toBe( "'" );
			expect( normalize( "“" ) ).toBe( "\"" );
			expect( normalize( "”" ) ).toBe( "\"" );
			expect( normalize( "〝" ) ).toBe( "\"" );
			expect( normalize( "〞" ) ).toBe( "\"" );
			expect( normalize( "〟" ) ).toBe( "\"" );
			expect( normalize( "‟" ) ).toBe( "\"" );
			expect( normalize( "„" ) ).toBe( "\"" );
		} );
	});
});
