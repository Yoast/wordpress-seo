var matchStringWithTransliteration = require( "../../js/stringProcessing/matchTextWithTransliteration.js" );

describe( "matches a string to it's transliterated value", function( ) {
	var str = "this is a string with the keyword in it";
	var keyword = "keyword";
	it( "returns a match in a string", function( ) {
		expect( matchStringWithTransliteration( str, keyword )[ 0 ] ).toBe( "keyword" );
	} );
	it( "returns a match in a string with spaces", function(){
		keyword = "the keyword";
		expect( matchStringWithTransliteration( str, keyword )[ 0 ] ).toBe( "the keyword" );
	} );
	it( "matches transliteration", function() {
		keyword = "këyword";
		expect( matchStringWithTransliteration( str, keyword, "en_US" )[ 0 ] ).toBe( "keyword" );
	});
} );
