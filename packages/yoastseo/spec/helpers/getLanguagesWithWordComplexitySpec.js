import { getLanguagesWithWordComplexity } from "../../src/helpers";
const supportedLanguages = [ "en", "es", "de", "fr" ];

describe( "a test to check whether we have word complexity support for a language", function() {
	it( "compares the array of languages for which we support word complexity to a test array", function() {
		expect( getLanguagesWithWordComplexity() ).toEqual( supportedLanguages );
	} );
} );
