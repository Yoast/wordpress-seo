import diacritics from "../../../../src/languageProcessing/helpers/transliterate/replaceDiacritics.js";

describe( "A test for removing diacritics from text.", function() {
	it( "returns string without diacritics.", function() {
		expect( diacritics( "Maïs" ) ).toBe( "Mais" );
		expect( diacritics( "âbçdēf" ) ).toBe( "abcdef" );
	} );
} );
