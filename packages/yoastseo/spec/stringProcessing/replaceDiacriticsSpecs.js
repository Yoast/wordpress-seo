import diacritics from "../../src/stringProcessing/replaceDiacritics.js";

describe( "a test removing diacritics from text", function() {
	it( "returns string without diacritics.", function() {
		expect( diacritics( "Maïs" ) ).toBe( "Mais" );
		expect( diacritics( "âbçdēf" ) ).toBe( "abcdef" );
	} );
} );
