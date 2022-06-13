import { getLanguagesWithWordFormSupport } from "../../src/helpers";
const supportedLanguagesSpec = [ "en", "de", "es", "fr", "it", "nl", "ru", "id", "pt", "pl", "ar", "sv", "he", "hu", "nb", "tr", "cs", "sk", "el", "ja" ];

describe( "a test to check whether we have morphology support for a language", function() {
	it( "compares the array of languages for which we support morphology to a test array", function() {
		expect( getLanguagesWithWordFormSupport() ).toEqual( supportedLanguagesSpec );
	} );
} );
