import getFunctionWordsLanguages from "../../src/helpers/_todo/getFunctionWordsLanguages";

describe( "Checks which languages have function word support in YoastSEO.js", function() {
	it( "returns an array of languages that have function word support", function() {
		expect( getFunctionWordsLanguages() ).toEqual( [ "en", "de", "nl", "fr", "es", "it", "pt", "ru", "pl", "sv", "id", "he", "ar", "fa" ] );
	} );
} );
